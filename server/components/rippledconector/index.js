let Q = require('q'),
    httpConnector = require('../httpconnector');

const config = global.config;

let OFFER_PASSIVE_FLAG = 65536,
    OFFER_IMMEDIATE_CANCEL_FLAG = 131072,
    OFFER_FILL_KILL_FLAG = 262144,
    OFFER_SELL_FLAG = 524288;


module.exports = {

    /*********************************************************************************************************************/
    /********************************************* SENDINGS **************************************************************/
    /*********************************************************************************************************************/
    callRipplePathFind: function() {
        return function (sourceAddress, destAddress, sourceCurrency, destCurrency, destAmount, destIssuer, transactionId, callback) {
            var request = {
                method: "ripple_path_find",
                params: [
                    {
                        destination_account: destAddress,
                        destination_amount: {
                            currency: destCurrency,
                            issuer: destIssuer,
                            value: destAmount.toString()
                        },
                        source_account: sourceAddress,
                        source_currencies: [
                            {
                                currency: sourceCurrency
                            }
                        ]
                    }
                ]
            };
            httpConnector.postApiCall(config.RIPPLEDDOMAIN, request, undefined, transactionId)
                .then(function (dataRippled) {
                    if(dataRippled.result.status === "success"){
                        callback(null, dataRippled.result);
                    }
                    else{
                        callback(errorMatcherLocal('INVALID_CALL_RIPPLE',dataRippled.result.error_message), null);
                    }
                })
                .fail(function (error) {
                    logger.error("lib.functions.util_rippled.callRipplePathFind.callRipple.error: " + JSON.stringify(error));
                    callback (responseErrorHandler(error), null);
                });

        };
    },


    callRippleSignAndSubmit: function () {
        return function (secret, sourceAccount, destAccount, destAmount, destCurrency, destIssuer, partialPayment, paths, sendMax, memos, transactionId, callback) {
            var request = {
                method: "submit",
                params: [
                    {
                        secret: secret,
                        tx_json: {
                            TransactionType: "Payment",
                            Account: sourceAccount,
                            Destination: destAccount,
                            Amount: {
                                currency: destCurrency,
                                value: destAmount.toString(),
                                issuer: destIssuer
                            }
                        }
                    }
                ]
            };

            if(sendMax) {
                request.params[0].tx_json.SendMax = sendMax;
            }

            if (partialPayment) {
               request.params[0].Flags = 131072;
            }
            if(memos) {
                request.params[0].tx_json.Memos = memos;
            }
            if(paths && paths.length > 0) {
                request.params[0].tx_json.Paths = paths;
            }
            httpConnector.postApiCall(config.RIPPLEDDOMAIN, request, undefined, transactionId)
                .then(function (dataRippled) {
                    if(dataRippled.result.status !== "success" || ((dataRippled.result.engine_result !== "tesSUCCESS") && (dataRippled.result.engine_result !== "terQUEUED"))){
                        var message = (dataRippled.result.error_message != undefined) ? dataRippled.result.error_message : dataRippled.result.engine_result_message;
                        callback(errorMatcherLocal('INVALID_CALL_RIPPLE', message), null);
                    }
                    else{
                        callback(null, dataRippled.result);
                    }
                })
                .fail(function (error) {
                    logger.error("lib.functions.util_rippled.callRippleSignAndSubmit.callRipple.error: " + JSON.stringify(error));
                    callback (responseErrorHandler(error));
                });
        };
    },


    /*********************************************************************************************************************/
    /********************************************* SENDINGS **************************************************************/
    /*********************************************************************************************************************/

    callRippleCreateOffer: function () {
        return function (secret, account, takerGets, takerPays, type, option, expirationTime, transactionId, callback) {
            var flags = 0;
            if(type === 'sell') {
                flags += OFFER_SELL_FLAG;
            }
            switch (option) {
                case 1:
                    flags += OFFER_PASSIVE_FLAG;
                    break;
                case 2:
                    flags += OFFER_IMMEDIATE_CANCEL_FLAG;
                    break;
                case 3:
                    flags += OFFER_FILL_KILL_FLAG;
                    break;
            }
            takerGets.value = takerGets.value.toString();
            takerPays.value = takerPays.value.toString();
            var request = {
                method: "submit",
                params: [
                    {
                        secret: secret,
                        tx_json: {
                            TransactionType: "OfferCreate",
                            Flags: flags,
                            Account: account,
                            TakerGets: takerGets,
                            TakerPays: takerPays

                        }
                    }
                ]
            };

            if(expirationTime) {
                request.params[0].tx_json.Expiration = expirationTime;
            }

            httpConnector.postApiCall(config.RIPPLEDDOMAIN, request, undefined, transactionId)
                .then(function (dataRippled) {
                    if(dataRippled.result.status !== "success" || ((dataRippled.result.engine_result !== "tesSUCCESS") && (dataRippled.result.engine_result !== "terQUEUED"))){
                        var message = (dataRippled.result.error_message != undefined) ? dataRippled.result.error_message : dataRippled.result.engine_result_message;
                        callback(errorMatcherLocal('INVALID_CALL_RIPPLE', message), null);
                    }
                    else{
                        callback(null, dataRippled.result);
                    }
                })
                .fail(function (error) {
                    callback (responseErrorHandler(error), null);
                });
        };
    }

};
