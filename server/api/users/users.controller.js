'use strict';

const config = global.config;
const rippleApi = config.rippleApi;

var generateNewAddress = function() {
  rippleApi.connect()
    .then(() => {
      /**
       * STEP 1: GENERATE RIPPLE ADDRESS
       */
      rippleApi.generateAddress()
        .then(info => {
          rippleApi.disconnect().then(() => { console.log("Disconnected") }).catch(console.error);
          return new Promise(info);
        })
        .catch(error => {
          //TODO: RETURN WHAT??
        })
    })
    .catch(error => {
      //TODO: RETURN WHAT??
    })
};

var prepareAndSignPayment = function(sourceAddress, destAddress, amount, currency) {
  rippleApi.connect()
    .then(() => {

      var payment = {
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
      console.log(config.rippleAccounts.activator.address);
      console.log(JSON.stringify(payment));
      return rippleApi.preparePayment(sourceAddress.address, payment);
    }).then(preparedPayment => {
        /**
         * STEP 3: SIGN PREPARED PAYMENT
         */
        return rippleApi.sign(preparedPayment.txJSON, sourceAddress.secret);
    }).then((signedPayment) => {
        rippleApi.disconnect().then(() => { console.log("Disconnected") }).catch(console.error);
        return new Promise(signedPayment);
    })
    .catch(error => {
      //TODO: RETURN WHAT??
    });
};


var prepareAndSignTrustline = function(sourceAddress, destAddress, currency) {
  rippleApi.connect()
    .then(() => {
      const trustline = {
        "currency": currency,//"BEE",
        "counterparty": destAddress.address,//config.rippleAccounts.coldBee.address,
        "limit": "100",
        "ripplingDisabled": false,
        "frozen": false
      };
      return rippleApi.prepareTrustline(trustline, payment);
    }).then(preparedTrustline => {
    /**
     * STEP 3: SIGN PREPARED TRUSTLINE
     */
    return rippleApi.sign(preparedTrustline.txJSON, sourceAddress.secret);
  }).then((signedTrustline) => {
    rippleApi.disconnect().then(() => { console.log("Disconnected") }).catch(console.error);
    return new Promise(signedTrustline);
  })
    .catch(error => {
      //TODO: RETURN WHAT??
    });
};

var combineAndSubmitSignedTransactions = function(signedTransaction) {
  rippleApi.connect()
    .then(() => {
    return rippleApi.combine(signedTransaction);
  }).then(joinedTransaction => {
    return rippleApi.submit(joinedTransaction.signedTransaction);
  }).then((result) => {
    rippleApi.disconnect().then(() => { console.log("Disconnected") }).catch(console.error);
    return new Promise(result);
  })
    .catch(error => {
      //TODO: RETURN WHAT??
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
  var email = req.body.email;
  var currency = req.body.currency;

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

  res.status(200).send("OK");
  // rippleApi.connect()
  //   .then(() => {
  //     /**
  //      * STEP 1: GENERATE RIPPLE ADDRESS
  //      */
  //     return rippleApi.generateAddress();
  //
  //   }).then(info => {
  //   console.log(JSON.stringify(info));
  //   console.log('getAccountInfo done');
  //   var wallet = {"secret":"snwEQnV34E189nvZmw5eDKYCr5tH3","address":"rQaVEm4GfG39VHNMWZGKrNXMxicu7BXE9D"};
  //
  //     /**
  //      *
  //      * STEP 2: PREPARE PAYMENT
  //      */
  //
  //   var payment = {
  //     source: {
  //       address: config.rippleAccounts.activator.address,
  //       maxAmount: {
  //        value: "40",
  //        currency: "XRP"
  //        }
  //     },
  //     destination: {
  //       address: wallet.address,
  //       amount: {
  //         value: "40",
  //         currency: "XRP"
  //       }
  //     }
  //   };
  //   console.log(config.rippleAccounts.activator.address);
  //   console.log(JSON.stringify(payment));
  //   return rippleApi.preparePayment(config.rippleAccounts.activator.address, payment);
  // }).then((preparedPayment) => {
  //   /**
  //    * STEP 3: SIGN PREPARED PAYMENT
  //    */
  //   return rippleApi.sign(preparedPayment.txJSON, config.rippleAccounts.activator.secret);
  // }).then((signedPayment) => {
  //   /**
  //    * STEP 4: PREPARE TRUSTLINE FROM NEW WALLET TO COLD WALLET
  //    */
  //   const trustline = {
  //     "currency": "BEE",
  //     "counterparty": config.rippleAccounts.coldBee.address,
  //     "limit": "100",
  //     "ripplingDisabled": false,
  //     "frozen": false
  //   };
  //   return rippleApi.submit(signedPayment.signedTransaction)
  // }).then((signedPayment) => {
  //   /**
  //    * OBJECT SIGNED. NEXT STEP, SUBMIT IT
  //    */
  //   return rippleApi.submit(signedPayment.signedTransaction)
  // }).then((transactionSubmitted) => {
  //   /**
  //    * OBJECT SIGNED. NEXT STEP, SUBMIT IT
  //    */
  //   res.status(200).send(transactionSubmitted);
  // }).then(() => {
  //   return rippleApi.disconnect();
  // }).then(() => {
  //   console.log("Disconnected")
  // }).catch((error) => {
  //   console.log(JSON.stringify(error));
  //   res.status(500).send(error);
  // });
}
