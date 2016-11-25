
let Q = require('q'),
    logger = require('../log/logger'),
    apiConnector = require('../httpconnector');

const config = global.config;

let rippleURLs = this.urls = {
    url_accounts : config.RIPPLEDOMAIN + config.RIPPLEVERSION + '/accounts/',
    ripple_transaction: config.RIPPLEDOMAIN + config.RIPPLEVERSION + '/transactions/:{transaction_hash}',
    get_generate_UUID : config.RIPPLEDOMAIN + config.RIPPLEVERSION + '/uuid',
    get_transaction_fee : config.RIPPLEDOMAIN + config.RIPPLEVERSION + '/transaction-fee',
    get_order_book: config.RIPPLEDOMAIN + config.RIPPLEVERSION + '/accounts/:{address}/order_book/:{base_currency}+:{base_counterparty}/:{destination_currency}+:{destination_counterparty}'
};


module.exports = {
    /*********************************************************************************************************************/
    /********************************************* ACCOUNTS **************************************************************/
    /*********************************************************************************************************************/
    callRippleBalance: function() {
        return function (address, getXRP, transactionId, callback) {
            logger.info('['+ transactionId + '] Calling Balance with address: ' + address);
            var getAllWalletsBalanceRippleUrl;
            if(getXRP){
                getAllWalletsBalanceRippleUrl = rippleURLs["url_accounts"] + address + '/balances?currency=XRP';
            }
            else {
                getAllWalletsBalanceRippleUrl = rippleURLs["url_accounts"] + address + '/balances';
            }
            logger.info('['+ transactionId + '] api.wallets.callBalanceRipple: Calling URL GET RIPPLE ' + getAllWalletsBalanceRippleUrl);
            apiConnector.getApiCall(getAllWalletsBalanceRippleUrl, undefined, undefined, transactionId)
                .then(function (dataRipple) {
                    if(dataRipple.success === true){
                        for(var k=0; k < dataRipple.balances.length; k++){
                            dataRipple.balances[k].value = Number(dataRipple.balances[k].value);
                        }
                        balanceWallets = dataRipple.balances;
                    }
                    else{
                        balanceWallets = [{
                            value: 0,
                            currency: "XRP",
                            counterparty: ""
                        }];
                    }
                    balance = {balances: balanceWallets};
                    callback(null, balance);
                })
                .fail(function (error) {
                    logger.info('['+ transactionId + '] api.wallets.callBalanceRipple.rippleCall.error: ' + error);
                    callback (responseErrorHandler(error));
                });
        };
    },


    /*********************************************************************************************************************/
    /*********************************************** PAYMENTS ************************************************************/
    /*********************************************************************************************************************/
    callRipplePreparePayment: function () {
        return function (source_account, destination_account, source_currency, destination_currency, destination_value, transactionId, callback) {
            var getPreparePaymentRippleUrl = rippleURLs["url_accounts"] + source_account + '/payments/paths/' + destination_account + '/' + destination_value + '+' + destination_currency + '?source_currencies=' + source_currency;
            logger.info('['+ transactionId + '] functions.util_ripple.callRipplePreparePayment: Calling RIPPLE ' + getPreparePaymentRippleUrl);
            apiConnector.getApiCall(getPreparePaymentRippleUrl, undefined, undefined, transactionId)
            .then (function (dataRipple){
                if(dataRipple.success === true){
                    callback(null, dataRipple);
                }
                else{
                    createNewPaymentRequest = errorMatcherLocal('INVALID_CALL_RIPPLE',dataRipple.message);
                    logger.error('['+ transactionId + '] lib.functions.util_ripple.callRipplePreparePayment.success.false: ' + JSON.stringify(createNewPaymentRequest));
                    callback(createNewPaymentRequest, null);
                }
            })
            .fail (function (error) {
                logger.error('['+ transactionId + '] lib.functions.util_ripple.callRipplePreparePayment.error: ' + error);
               callback(responseErrorHandler('GENERAL_ERROR'), null);
            });
        };
    },
    callRippleSubmitPayment: function () {
        return function (source_secret, payments, uuid, transactionId, callback) {
            var postSubmitPaymentRippleUrl = rippleURLs["url_accounts"] + payments.source_account + '/payments?validated=true';
            var jsonSubmitPaymentRipple = {
                secret: source_secret,
                client_resource_id: uuid,
                payment: payments
            };
            logger.info('['+ transactionId + '] functions.util_ripple.callRippleSubmitPayment: Calling RIPPLE ' + postSubmitPaymentRippleUrl);
            apiConnector.postApiCall(postSubmitPaymentRippleUrl, jsonSubmitPaymentRipple, undefined, transactionId)
                .then(function (dataRipple) {
                    if(dataRipple.success === true){
                        callback(null, dataRipple);
                    }
                    else{
                        callback(errorMatcherLocal('INVALID_CALL_RIPPLE',dataRipple.message), null);
                    }
                })
                .fail(function (error) {
                    logger.error("lib.functions.util_payments.callRippleSubmitPayment.callRippleSubmitPayment.error: " + JSON.stringify(error));
                    callback (responseErrorHandler(error));
                });
        };
    },

    /*********************************************************************************************************************/
    /********************************************** UTILITIES ************************************************************/
    /*********************************************************************************************************************/
    callRippleRetreiveTransaction: function () {
        return function (hash, transactionId, callback) {
            var getTransactionRippleUrl = rippleURLs["ripple_transaction"].replace(':{transaction_hash}', hash);
            logger.info('['+ transactionId + '] functions.util_ripple.callRippleRetreiveTransaction: Calling RIPPLE ' + getTransactionRippleUrl);
            apiConnector.getApiCall(getTransactionRippleUrl, undefined, undefined, transactionId)
                .then(function (dataRipple) {
                    if(dataRipple.success === true) {
                        callback(null, dataRipple);
                    }
                    else {
                        callback(errorMatcherLocal('INVALID_CALL_RIPPLE',dataRipple.message), null);
                    }
                })
                .fail(function (error) {
                    callback (responseErrorHandler(error));
                });
        };
    },
    callRippleFee: function () {
        return function (transactionId, callback) {
            var getTransactionFeeRippleUrl = rippleURLs["get_transaction_fee"];
            logger.info('['+ transactionId + '] functions.util_payments.returnFeeRipple: Calling RIPPLE ' + getTransactionFeeRippleUrl);
            apiConnector.getApiCall(getTransactionFeeRippleUrl, undefined, undefined, transactionId)
                .then (function (dataRipple){
                    if(dataRipple.success === true){
                        callback(null, dataRipple.fee);
                    }
                    else{
                        response = errorMatcherLocal('INVALID_CALL_RIPPLE',dataRipple.message);
                        callback (response,null);
                    }
                })
                .fail (function (error) {
                    callback(responseErrorHandler(error));
                });
        };
    },
    callRippleUUID: function () {
        return function (transactionId, callback) {
            var getGenerateUUIDRippleUrl = rippleURLs["get_generate_UUID"];
            logger.info('['+ transactionId + '] functions.util_ripple.callRippleUUID: Calling RIPPLE ' + getGenerateUUIDRippleUrl);
            apiConnector.getApiCall(getGenerateUUIDRippleUrl, undefined, undefined, transactionId)
                .then (function (dataRipple){
                    if(dataRipple.success === true){
                        callback(null, dataRipple.uuid);
                    }
                    else{
                        response = errorMatcherLocal('INVALID_CALL_RIPPLE',dataRipple.message);
                        callback (response,null);
                    }
                })
                .fail (function (error) {
                    callback(responseErrorHandler(error));
                });
        };
    },

    /*********************************************************************************************************************/
    /************************************************ ORDERS *************************************************************/
    /*********************************************************************************************************************/
    callRippleGetOrderBook: function () {
        return function (baseAddress, baseCurrency, baseCounterparty, destinationCurrecy, destinationCounterparty, transactionId, callback) {
            var getOrderBookRippleUrl = rippleURLs["get_order_book"].replace(':{address}', baseAddress).replace(':{base_currency}', baseCurrency).replace(':{base_counterparty}', baseCounterparty).replace(':{destination_currency}', destinationCurrecy).replace(':{destination_counterparty}', destinationCounterparty);
            logger.info('['+ transactionId + '] functions.util_ripple.callRippleGetOrderBook: Calling RIPPLE ' + getOrderBookRippleUrl);
            apiConnector.getApiCall(getOrderBookRippleUrl, undefined, undefined, transactionId)
                .then (function (dataRipple){
                    if(dataRipple.success === true){
                        callback(null, dataRipple);
                    }
                    else{
                        response = errorMatcherLocal('INVALID_CALL_RIPPLE',dataRipple.message);
                        callback (response,null);
                    }
                })
                .fail (function (error) {
                    callback(responseErrorHandler(error), null);
                });
        };
    }
};
