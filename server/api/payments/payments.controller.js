'use strict';

import logger from '../../components/logger';
const config = global.config;
const rippleApi = config.rippleApi;

/**
 * PAYMENT
 */
exports.createPayment = (req, res) => {
  logger.info('api.payments.createPayment: Init');
  let sourceAddress = req.body.sourceAddress;
  let sourceSecret= req.body.sourceSecret;
  let currency= req.body.currency;
  let destAddress= req.body.destAddress;
  let amount= req.body.amount;
  rippleApi.connect()
    .then(() => {
      let payment = {
        source: {
          address: sourceAddress,
          maxAmount: {
            value: amount,
            currency: currency
          }
        },
        destination: {
          address: destAddress,
          amount: {
            value: amount,
            currency: currency
          }
        }
      };
      logger.info('api.payments.createPayment: Payment', payment);
      return rippleApi.preparePayment(sourceAddress, payment);
    })
    .then(preparedPayment => {
      logger.info('api.payments.createPayment: preparedPayment', preparedPayment);
      return rippleApi.sign(preparedPayment.txJSON, sourceSecret);
    })
    .then((signedPayment) => {
      logger.info('api.payments.createPayment: signedPayment', signedPayment);
      return rippleApi.submit(signedPayment.signedTransaction);
    })
    .then((result) => {
      rippleApi.disconnect();
      if (result.resultCode === "tesSUCCESS") {
        logger.info('api.payments.createPayment: SUCCESS', result.resultMessage);
        res.status(200).json({
          result: {
            code: 200,
            info: result.resultMessage
          },
          data: {
            transactionId: signedPayment.id
          }
        });
      } else {
        logger.info('api.payments.createPayment: FAIL', result.resultMessage);
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
      logger.info('api.payments.createPayment: FAIL', error);
      res.status(500).json({
        result: {
          code: 500,
          info: error
        }
      });
    });
  logger.info('api.payments.createPayment: End');
};
/**
 * GET PAYMENT
 */
exports.listPayment = (req, res) => {
  logger.info('api.payments.listPayment: Init');
  let address = req.body.address;
  rippleApi.connect()
    .then(() => {
      logger.info('api.payments.listPayment: address', address);
      return rippleApi.getTransactions(address);
    })
    .then((result) => {
      rippleApi.disconnect();
      if (result.resultCode === "tesSUCCESS") {
        logger.info('api.payments.listPayment: SUCCESS', result.resultMessage);
        res.status(200).json({
          result: {
            code: 200,
            info: result.resultMessage
          }
        });
      } else {
        logger.info('api.payments.listPayment: FAIL', result.resultMessage);
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
      logger.info('api.payments.listPayment: FAIL', error);
      res.status(500).json({
        result: {
          code: 500,
          info: error
        }
      });
    });
  logger.info('api.payments.listPayment: End');
};
/**
 * GET BALANCE
 */
exports.listBalance = (req, res) => {
  logger.info('api.payments.listBalance: Init');
  let address = req.body.address;
  rippleApi.connect()
    .then(() => {
      logger.info('api.payments.listBalance: address', address);
      return rippleApi.getBalances(address);
    })
    .then((result) => {
      rippleApi.disconnect();
      if (result.resultCode === "tesSUCCESS") {
        logger.info('api.payments.listBalance: SUCCESS', result.resultMessage);
        res.status(200).json({
          result: {
            code: 200,
            info: result.resultMessage
          }
        });
      } else {
        logger.info('api.payments.listBalance: FAIL', result.resultMessage);
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
      logger.info('api.payments.listBalance: FAIL', error);
      res.status(500).json({
        result: {
          code: 500,
          info: error
        }
      });
    });
  logger.info('api.payments.listBalance: End');
};
