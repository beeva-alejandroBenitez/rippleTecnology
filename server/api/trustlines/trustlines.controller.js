'use strict';

import logger from '../../components/logger';
const config = global.config;
const rippleApi = config.rippleApi;

/**
 * CREATE TRUSTLINE
 */
exports.createTrustline = (req, res) => {
  logger.info('api.trustlines.createTrustline: Init');
  let sourceAddress = req.body.sourceAddress;
  let sourceSecret= req.body.sourceSecret;
  let currency= req.body.currency;
  let destAddress= req.body.destAddress;
  let limit = req.body.limit;
  let ripplingDisabled = (ripplingDisabled) ? req.body.ripplingDisabled : false; //Optional If true, payments cannot ripple through this trustline.
  let frozen = (frozen) ? req.body.frozen : false; //Optional If true, the trustline is frozen, which means that funds can only be sent to the owner.
  rippleApi.connect()
    .then(() => {
      let trustline = {
        "currency": currency,//"BEE",
        "counterparty": destAddress,//config.rippleAccounts.coldBee.address,
        "limit": limit,
        "ripplingDisabled": ripplingDisabled,
        "frozen": frozen
      };
      logger.info('api.trustlines.createTrustline: trustline', trustline);
      return rippleApi.prepareTrustline(sourceAddress, trustline);
    })
    .then(preparedTrustline => {
      logger.info('api.trustlines.createTrustline: preparedTrustline', preparedTrustline);
      return rippleApi.sign(preparedTrustline.txJSON, sourceSecret);
    })
    .then((signedTrustline) => {
      logger.info('api.trustlines.createTrustline: signedTrustline', signedTrustline);
      return rippleApi.submit(signedTrustline.signedTransaction);
    })
    .then((result) => {
      rippleApi.disconnect();
      if (result.resultCode === "tesSUCCESS") {
        logger.info('api.trustlines.createTrustline: SUCCESS', result.resultMessage);
        res.status(200).json({
          result: {
            code: 200,
            info: result.resultMessage
          },
          data: {
            transactionId: signedTrustline.id
          }
        });
      } else {
        logger.info('api.trustlines.createTrustline: FAIL', result.resultMessage);
        res.status(500).json({
          result: {
            code: 500,
            info: result.resultMessage
          }
        });
      }
    })
    .catch((error) => {
      rippleApi.disconnect();
      logger.info('api.trustlines.createTrustline: FAIL', error);
      res.status(500).json({
        result: {
          code: 500,
          info: error
        }
      });
    });
  logger.info('api.trustlines.createTrustline: End');
};

/**
 * GET TRUSTLINE
 */
exports.listTrustline = (req, res) => {
  logger.info('api.trustlines.listTrustline: Init');
  let address = req.body.address;
  rippleApi.connect()
    .then(() => {
      logger.info('api.trustlines.listTrustline: address', address);
      return rippleApi.getTrustlines(address);
    })
    .then((result) => {
      rippleApi.disconnect();
      if (result.resultCode === "tesSUCCESS") {
        logger.info('api.trustlines.listTrustline: SUCCESS', result.resultMessage);
        res.status(200).json({
          result: {
            code: 200,
            info: result.resultMessage
          }
        });
      } else {
        logger.info('api.trustlines.listTrustline: FAIL', result.resultMessage);
        res.status(500).json({
          result: {
            code: 500,
            info: result.resultMessage
          }
        });
      }
    })
    .catch((error) => {
      rippleApi.disconnect();
      logger.info('api.trustlines.listTrustline: FAIL', error);
      res.status(500).json({
        result: {
          code: 500,
          info: error
        }
      });
    });
  logger.info('api.trustlines.listTrustline: End');
};
