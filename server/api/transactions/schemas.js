'use strict';

exports.retrieveTransaction = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'alphanumeric',
      minLength: 64,
      maxLength: 64
    },
    address: {
      type: 'string'
    }
  }
};
