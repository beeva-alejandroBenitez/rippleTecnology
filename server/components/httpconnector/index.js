/**
 * Created by alberto.blanco on 05/11/2016.
 */

'use strict';

var Q = require('q'),
    requestlib = require('request');

export function getApiCall (urlRequest, queryParams, headers) {
  var deferred = Q.defer();
  requestlib.get({
    url: urlRequest,
    qs: queryParams,
    headers: headers
  }, function (error, response, body) {
    if(error) {
      deferred.reject('GENERAL_ERROR');
    }
    else {
      try {
        var responseJson = JSON.parse(body);
        deferred.resolve(responseJson);
      } catch (e) {
        deferred.reject('GENERAL_ERROR: ' + e);
      }
    }
  });
  return deferred.promise;
};

export function postApiCall (urlRequest, jsonRequest, headers) {
  var deferred = Q.defer();
  if(!headers) {
    headers = {"content-type": "application/json"};
  }
  var options = {
    url: urlRequest,
    json: jsonRequest,
    headers: headers
  };
  if(headers["content-type"] === "application/x-www-form-urlencoded") {
    delete options.json;
    options.form = jsonRequest;
  }

  requestlib.post(options, function (error, response, body) {
    if(error) {
      deferred.reject('GENERAL_ERROR');
    }
    else {
      try {
        if(typeof body === 'string' || body instanceof String) {
          body = JSON.parse(body);
        }
        deferred.resolve(body);
      } catch(e) {
        deferred.reject('GENERAL_ERROR: ' + e);
      }
    }
  });

  return deferred.promise;
};

export function putApiCall (urlRequest, jsonRequest, headers) {
  var deferred = Q.defer();
  requestlib.put({
    url: urlRequest,
    json: jsonRequest,
    headers: headers
  }, function (error, response, body) {
    if(error) {
      deferred.reject('GENERAL_ERROR');
    }
    else {
      try {
        if(typeof body === 'string' || body instanceof String) {
          body = JSON.parse(body);
        }
        deferred.resolve(body);
      } catch(e) {
        deferred.reject('GENERAL_ERROR: ' + e);
      }
    }
  });

  return deferred.promise;
};

export function delApiCall (urlRequest, jsonRequest, headers) {
  var deferred = Q.defer();
  requestlib.del({
    url: urlRequest,
    json: jsonRequest,
    headers: headers
  }, function (error, response, body) {
    if(error) {
      deferred.reject('GENERAL_ERROR');
    }
    else {
      try {
        if(typeof body === 'string' || body instanceof String) {
          body = JSON.parse(body);
        }
        deferred.resolve(body);
      } catch(e) {
        deferred.reject('GENERAL_ERROR: ' + e);
      }
    }
  });

  return deferred.promise;
};
