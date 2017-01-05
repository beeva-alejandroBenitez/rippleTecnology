'use strict';

const rippleApi = global.config.rippleApi;

exports.createOrder = (req, res) => {
  let instructions, transactionId;
  rippleApi.connect()
    .then(() => {
      return (req.body.instructions) ?
        rippleApi.prepareOrder(req.body.address, req.body.order, req.body.instructions) :
        rippleApi.prepareOrder(req.body.address, req.body.order);
    })
    .then(prepared => {
      instructions = prepared.instructions;
      return rippleApi.sign(prepared.txJSON, req.body.secret);
    })
    .then((signed) => {
      transactionId = signed.id;
      return rippleApi.submit(signed.signedTransaction);
    })
    .then((result) => {
      rippleApi.disconnect();
      if (result.resultCode === "tesSUCCESS") {
        res.status(202).json({
          result: {
            code: 202,
            info: result.resultMessage
          },
          data: {
            transactionId: transactionId,
            instructions: instructions
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

exports.orderCancellation = (req, res) => {
  let instructions, transactionId;
  rippleApi.connect()
    .then(() => {
      return (req.body.instructions) ?
        rippleApi.prepareOrderCancellation(req.body.address, req.body.orderCancellation, req.body.instructions) :
        rippleApi.prepareOrderCancellation(req.body.address, req.body.orderCancellation);
    })
    .then(prepared => {
      instructions = prepared.instructions;
      return rippleApi.sign(prepared.txJSON, req.body.secret);
    })
    .then((signed) => {
      transactionId = signed.id;
      return rippleApi.submit(signed.signedTransaction);
    })
    .then((result) => {
      rippleApi.disconnect();
      if (result.resultCode === "tesSUCCESS") {
        res.status(202).json({
          result: {
            code: 202,
            info: result.resultMessage
          },
          data: {
            transactionId: transactionId,
            instructions: instructions
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

exports.retrieveOrder = (req, res) => {
  rippleApi.connect()
    .then(() => {
      return rippleApi.getOrders(req.params.address);
    })
    .then((orders) => {
      rippleApi.disconnect();
        res.status(200).json({
          result: {
            code: 200,
            info: "Success"
          },
          data: {
            orders: orders
          }
        });
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
