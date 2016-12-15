'use strict';

// const httpConnector = require(`${global.config.components}/httpconnector`);
import httpConnector from '../../components/httpconnector';

const OFFER_PASSIVE_FLAG = 65536,
  OFFER_IMMEDIATE_CANCEL_FLAG = 131072,
  OFFER_FILL_KILL_FLAG = 262144,
  OFFER_SELL_FLAG = 524288;

const callRippleCreateOffer = function (re, res) {
  if (req.body.account && req.body.takerGets && req.body.takerPays && req.body.type) {
    // return function (secret, account, takerGets, takerPays, type, option, expirationTime, transactionId) {
      let option = option || OFFER_PASSIVE_FLAG;
      var flags = 0;
      if (req.body.type === 'sell') {
        flags += OFFER_SELL_FLAG;
      }
      switch (option) {
        case 1:
          flags += OFFER_PASSIVE_FLAG;
          break;
        case 2:
          flags += OFFER_IMMEDIATE_CANCEL_FLAG;
          break;
        case 3:
          flags += OFFER_FILL_KILL_FLAG;
          break;
      }

      let takerGets = req.body.takerGets;
      takerGets.value = takerGets.value.toString();

      let takerPays = req.body.takerPays;
      takerPays.value = takerPays.value.toString();

      var request = {
        method: "submit",
        params: [
          {
            secret: secret,
            tx_json: {
              TransactionType: "OfferCreate",
              Flags: flags,
              Account: req.body.account,
              TakerGets: takerGets,
              TakerPays: takerPays
            }
          }
        ]
      };

      // if (expirationTime) {
      //   request.params[0].tx_json.Expiration = expirationTime;
      // }

      httpConnector.postApiCall(global.config.RIPPLEDDOMAIN, request, undefined)
        .then(function (dataRippled) {
          if (dataRippled.result.status !== "success" || ((dataRippled.result.engine_result !== "tesSUCCESS") && (dataRippled.result.engine_result !== "terQUEUED"))) {
            var message = (dataRippled.result.error_message != undefined) ? dataRippled.result.error_message : dataRippled.result.engine_result_message;
            // callback(errorMatcherLocal('INVALID_CALL_RIPPLE', message), null);
            res.status(500).json({
              code: 500,
              info: message
            });
          }
          else {
            // callback(null, dataRippled.result);
            res.status(200).json({
              code: 200,
              info: dataRippled.result
            });
          }
        })
        .fail(function (error) {
          // callback(responseErrorHandler(error), null);
          res.status(500).json({
            code: 500,
            info: error
          });
        });
  } else {
    res.status(400).json({
      code: 400,
      info: 'Bad request'
    });
  }
};

export function create(req, res) {
  callRippleCreateOffer(req, res);
}
