'use strict';

const rippleApi = global.config.rippleApi;

exports.createOrder = (req, res) => {
  rippleApi.connect()
    .then(() => {
      return rippleApi.prepareOrder(req.body.address, req.body.order);
    })
    .then(prepared => {
      return rippleApi.sign(prepared.txJSON, req.body.secret);
    })
    .then((signed) => {
      return rippleApi.submit(signed.signedTransaction);
    })
    .then((result) => {
      rippleApi.disconnect();
      if (result.resultCode === "tesSUCCESS") {
        res.status(200).json({
          result: {
            code: 200,
            info: result.resultMessage
          },
          data: {
            transactionId: signed.id
          }
        });
      } else {
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
      res.status(500).json({
        result: {
          code: 500,
          info: error
        }
      });
    });
};
