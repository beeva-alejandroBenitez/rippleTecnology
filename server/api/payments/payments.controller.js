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
      logger.info('api.payments.createPayment: FAIL', result.resultMessage);
      res.status(500).json({
        result: {
          code: 500,
          info: error
        }
      });
    });
  logger.info('api.payments.createPayment: End');
};
