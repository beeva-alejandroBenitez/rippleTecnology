/**
 * Main application file
 */

'use strict';

import express from 'express';
import http from 'http';
const config = require('./config/environment');

const { RippleAPI } = require('ripple-lib');

config.rippleApi = new RippleAPI({
  server: config.rippledEndpoint // Public rippled server
});

config.rippleApi.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});
config.rippleApi.on('connected', () => {
  console.log('connected');
});
config.rippleApi.on('disconnected', (code) => {
  // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
  // will be 1000 if this was normal closure
  console.log('disconnected, code:', code);
});

global.config = config;

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
module.exports = app;
