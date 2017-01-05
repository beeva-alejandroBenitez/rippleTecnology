'use strict';

exports.createTrustline = {
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
    limit: {
      type: "string",
      required: true
    },
    ripplingDisabled: {
      type: "boolean"
    },
    frozen: {
      type: "boolean"
    }
  }
};
