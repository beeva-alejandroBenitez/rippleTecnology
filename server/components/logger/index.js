'use strict';

const winston = require('winston');
const moment = require('moment');

function timeFormatFn() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

function formatter(options) {
  return `[${options.timestamp()}][${options.level.toUpperCase()}]: ${(undefined !== options.message ? options.message : '')}
        ${(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' )}`;
}

let logger = new (winston.Logger)({
  transports: [
    new (require('winston-daily-rotate-file'))({
      filename: global.config.logsPath + '/ripple-connector.log',
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      timestamp: timeFormatFn,
      formatter: formatter,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      level: 'debug',
      json: false
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({filename: global.config.logsPath + '/logger_exceptions.log'})
  ],
  exitOnError: false,
});

module.exports = logger;
