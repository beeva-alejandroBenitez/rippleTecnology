'use strict';

const rippleApi = global.config.rippleApi;

exports.retrieveTransaction = (req, res) => {
  let method, param;
  if (req.query.id) {
    method = 'getTransaction';
    param = req.query.id;
  } else if (req.query.address) {
    method = 'getTransactions';
    param = req.query.address;
  }
  
  if (method) {
    rippleApi.connect()
      .then(() => {
        return rippleApi[method](param);
      })
      .then(transactions => {
        rippleApi.disconnect();
        res.status(200).json({
          result: {
            code: 200,
            info: 'Success'
          },
          data: Array.isArray(transactions) ? {
            transactions: transactions
          } : transactions
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
  } else {
    res.status(400).json({
      result: {
        code: 400,
        info: "Bad Request",
        description: "Transaction ID or address are necessary"
      }
    });
  }
};
