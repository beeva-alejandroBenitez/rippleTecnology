'use strict';

const httpConnector = require(`${global.config.components}/httpconnector`);

export function list(req, res) {
  httpConnector.getApiCall();
  res.end();
}

export function create(req, res) {
  
  res.end();
}