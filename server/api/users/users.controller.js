'use strict';

let async = require('async');
const config = global.config;
const rippleApi = config.rippleApi;

let generateNewWallet = function(callback) {
  rippleApi.connect()
    .then(() => {
      /**
       * STEP 1: GENERATE RIPPLE ADDRESS
       */
      return rippleApi.generateAddress();
    })
    .then(info => {
      rippleApi.disconnect()
        .then(() => {
          console.log("GENERATE ADDRESS. Ripple Disconnected");
          callback(null, info);
        })
        .catch(error => {
          console.error(JSON.stringify(error));
          callback(error, null);
        })
    })
    .catch(error => {
      console.error(JSON.stringify(error));
      callback(error, null);
    })
};

let createPayment = function(sourceAddress, sourceSecret, destAddress, amount, currency, callback) {
  rippleApi.connect()
    .then(() => {
      let payment = {
        source: {
          address: sourceAddress,//config.rippleAccounts.activator.address,
          maxAmount: {
            value: amount,//"40",
            currency: currency//"XRP"
          }
        },
        destination: {
          address: destAddress,
          amount: {
            value: amount,//"40",
            currency: currency//"XRP"
          }
        }
      };
      console.log("PREPARE PAYMENT:::::::::::::::::");
      console.log(JSON.stringify(payment));
      console.log("::::::::::::::::::::::::::");
      return rippleApi.preparePayment(sourceAddress, payment);
    }).then(preparedPayment => {
        /**
         * STEP 3: SIGN PREPARED PAYMENT
         */
        console.log("SIGN PAYMENT:::::::::::::::::");
        console.log("::::::::::::::::::::::::::");
        return rippleApi.sign(preparedPayment.txJSON, sourceSecret);
    }).then(signedPayment => {
      console.log("PAYMENT SIGNED:::::::::::::::::");
      return rippleApi.submit(signedPayment.signedTransaction);
    }).then((result) => {
      console.log("PAYMENT SUBMITTED:::::::::::::::::");
      rippleApi.disconnect()
        .then(() => {
          console.log("PAYMENT. Ripple Disconnected");
          if(result.resultCode === "tesSUCCESS") {
            callback(null, result);
          }
          else {
            callback(result, null);
          }
        })
        .catch(error => {
          console.error(JSON.stringify(error));
          callback(error, null);
        })
    })
    .catch(rippleError => {
      console.error(JSON.stringify(rippleError));
      callback(rippleError, null);
    });
};


let createTrustline = function(sourceAddress, sourceSecret, destAddress, currency, callback) {
  rippleApi.connect()
    .then(() => {
      const trustline = {
        "currency": currency,//"BEE",
        "counterparty": destAddress,//config.rippleAccounts.coldBee.address,
        "limit": "100",
        "ripplingDisabled": false,
        "frozen": false
      };
      console.log("PREPARE TRUSTLINE:::::::::::::::::");
      console.log("FROM: " + sourceAddress + " TO: " + destAddress + " FOR CURRENCY: " + currency);
      console.log(JSON.stringify(trustline));
      console.log("::::::::::::::::::::::::::");
      return rippleApi.prepareTrustline(sourceAddress, trustline);
    }).then(preparedTrustline => {
      /**
       * STEP 3: SIGN PREPARED TRUSTLINE
       */
      console.log("SIGN TRUSTLINE:::::::::::::::::");
      console.log("FROM: " + sourceAddress + " TO: " + destAddress + " FOR CURRENCY: " + currency);
      console.log("::::::::::::::::::::::::::");
      return rippleApi.sign(preparedTrustline.txJSON, sourceSecret);
    }).then(signedTrustline => {
        console.log("TRUSTLINE SIGNED:::::::::::::::::");
        return rippleApi.submit(signedTrustline.signedTransaction);
    }).then((result) => {
      console.log("TRUSTLINE SUBMITTED:::::::::::::::::");
      rippleApi.disconnect()
        .then(() => {
          console.log("TRUSTLINE. Ripple Disconnected");
          if (result.resultCode === "tesSUCCESS") {
            callback(null, result);
          }
          else {
            callback(result, null);
          }
        })
        .catch(error => {
          console.error(JSON.stringify(error));
          callback(error, null);
        })
    })
    .catch(error => {
      callback(error, null);
    });
};

let combineAndSubmitSignedTransactions = function(signedTransaction, callback) {
  rippleApi.connect()
    .then(() => {
      return rippleApi.combine(signedTransaction);
    }).then(joinedTransaction => {
      console.log("JOINING TRANSACTIONS:::::::::::::::::");
      console.log("::::::::::::::::::::::::::");
      return rippleApi.submit(joinedTransaction.signedTransaction);
    }).then((result) => {
      console.log("SUBMITTING TRANSACTIONS:::::::::::::::::");
      console.log("::::::::::::::::::::::::::");
      rippleApi.disconnect()
        .then(() => {
          console.log("SUBMIT TRANSACTION Disconnected");
          callback(null, result);
        })
        .catch(error => {
          console.error(JSON.stringify(error));
          callback(error, null);
        });
    })
    .catch(error => {
      callback(error, null);
    });
};

export function test(req, res) {
  rippleApi.connect()
    .then(() => {
      /* begin custom code ------------------------------------ */
      const myAddress = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';

      console.log('getting account info for', myAddress);
      return rippleApi.getAccountInfo(myAddress);

    }).then(info => {
    console.log(JSON.stringify(info));
    console.log('getAccountInfo done');
    res.status(200).send("OK");
    /* end custom code -------------------------------------- */
  }).then(() => {
    return rippleApi.disconnect();
  }).then(() => {
    console.log("Disconnected")
  }).catch(console.error);
}

export function list(req, res) {
  httpConnector.getApiCall();
  res.end();
}

export function create(req, res) {
  let email = req.body.email;
  let currency = req.body.currency;
  let coldWallet = (currency === "BEE") ? config.rippleAccounts.coldBee : config.rippleAccounts.coldGee;
  /**
   * STEPS:
   *  1.- Call generateNewAddress to get a new Address and Secret and keep both
   *  2.- Call prepareAndSignPayment of 40 XRP from activator to new Address, Keep "signedTransaction" attribute
   *  3.- Call prepareAndSignTrustline from new Address to cold Wallet, Keep "signedTransaction" attribute
   *  4.- Call prepareAndSignTrustline from cold Wallet to new Address, Keep "signedTransaction" attribute
   *  5.- Call combineAndSubmitSignedTransactions to merge ALL "signedTransaction" and submit then
   *  6.- Store in Mongo Wallet:
   *      {
   *        email,
   *        address,
   *        secret
   *      }
   *
   */
  generateNewWallet(function (errorGenWallet, newWallet){
    if(errorGenWallet) {
      res.status(500).json(errorGenWallet);
    }
    else {
      console.log("NEW WALLET:::::::::::::::::");
      console.log(JSON.stringify(newWallet));
      console.log("::::::::::::::::::::::::::");
      async.series([
        function (callback) {
          createPayment(config.rippleAccounts.activator.address, config.rippleAccounts.activator.secret, newWallet.address, "40", 'XRP', callback);
        },
        function (callback) {
          createTrustline(newWallet.address, newWallet.secret, coldWallet.address, currency, callback);
        },
        function (callback) {
          createTrustline(coldWallet.address, coldWallet.secret, newWallet.address, currency, callback);
        }
      ],
      function (errorSerie, resultSerie) {
        if(errorSerie) {
          res.status(500).json(errorSerie);
        }
        else {
          /**
           * TODO: INSERT IN DB
           */
          let response = {
            user: {
              email: req.body.email,
              wallet: newWallet.address
            }
          };
          res.status(200).send(response);
        }
      });
    }
  });
}
