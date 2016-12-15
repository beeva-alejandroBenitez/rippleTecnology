'use strict';

import restCall from '../../components/httpconnector';
import logger from '../../components/logger';
import async from 'async';

const config = global.config;
const rippleEndpoint = config.rippleEndpoint;
const rippleVersion = config.rippleEndpoint;

// let rippleURLs = this.urls = {
//   url_accounts : rippleEndpoint + rippleVersion + '/accounts/',
//   ripple_transaction: rippleEndpoint + rippleVersion + '/transactions/:{transaction_hash}',
//   get_generate_UUID : rippleEndpoint + rippleVersion + '/uuid',
//   get_transaction_fee : rippleEndpoint + rippleVersion + '/transaction-fee',
//   get_order_book: rippleEndpoint + rippleVersion + '/accounts/:{address}/order_book/:{base_currency}+:{base_counterparty}/:{destination_currency}+:{destination_counterparty}'
// };

const header = {
  "content-type": "application/json"
};

/**
 * Prepare Payments
 */
export function preparePayments(req, res) {
  let source_account = 'rLDfaRrxBZ9RuFiUndwtrzZHkYLTPBL1oC';
  let destination_account = 'rQH8evp6DMQ9FKsyb4rbZPkrZA7g7xEXha';
  let destination_value = '1';
  let destination_currency = 'BEECOIN';
  let source_currency = 'LABCOIN';
  var preparePaymentRippleUrl = rippleURLs["url_accounts"] + source_account + '/payments/paths/' + destination_account + '/' + destination_value + '+' + destination_currency + '?source_currencies=' + source_currency;
  logger.info('api.payments.preparePayments: Calling RIPPLE ' + preparePaymentRippleUrl);
  return restCall.getApiCall(preparePaymentRippleUrl, undefined, undefined)
    .then(response => {
      console.log('RESPONSE:::' + response);
      res.status(response.result.status_code).json(response);
    })
    .catch(error => {
      console.log('CATCH:::' + error);
      res.status(500).json(error);
    });
}

/**
 * Submit Payments
 */
export function submitPayments(req, res) {
  let source_secret;
  let payments;
  let uuid;
  var submitPaymentRippleUrl = rippleURLs["url_accounts"] + payments.source_account + '/payments?validated=true';
  var jsonSubmitPaymentRipple = {
    secret: source_secret,
    client_resource_id: uuid,
    payment: payments
  };
  logger.info('api.payments.submitPayments: Calling RIPPLE ' + submitPaymentRippleUrl);
  return restCall.postApiCall(submitPaymentRippleUrl, jsonSubmitPaymentRipple, undefined)
    .then(response => {
      console.log('RESPONSE SUBMIT:::' + response);
      res.status(response.result.status_code).json(response);
    })
    .catch(error => {
      console.log('CATCH SUBMIT:::' + error);
      res.status(500).json(error);
    });
}
