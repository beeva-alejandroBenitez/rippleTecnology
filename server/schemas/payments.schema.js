'use strict';

exports.createPayment = {
  type: 'object',
  properties: {
    sourceAddress: {
      type: "string",
      required: true
    },
    sourceSecret: {
      type: "string",
      required: true
    },
    currency: {
      type: "string",
      required: true
    },
    destAddress: {
      type: "string",
      required: true
    },
    amount: {
      type: "string",
      required: true
    }
  }
};
