'use strict';

exports.createOrder = {
  type: 'object',
  properties: {
    address: {
      type: "string",
      required: true
    },
    secret: {
      type: "string",
      required: true
    },
    order: {
      type: "object",
      required: true,
      properties: {
        direction: {
          type: 'string',
          required: true,
          enum: ['buy', 'sell']
        },
        quantity: {
          type: 'object',
          required: true,
          properties: {
            currency: {
              type: 'string',
              required: true
            },
            counterparty: {
              type: 'string',
              required: true
            },
            value: {
              type: 'string',
              required: true
            }
          }
        },
        totalPrice: {
          type: 'object',
          required: true,
          properties: {
            currency: {
              type: 'string',
              required: true
            },
            value: {
              type: 'string',
              required: true
            }
          }
        },
        passive: {
          type: "boolean"
        },
        fillOrKill: {
          type: "boolean"
        },
        immediateOrCancel: {
          type: "boolean"
        },
        expirationTime: {
          type: "string"
        }
      }
    }
  }
};