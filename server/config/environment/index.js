'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Componenets path of server
  components: path.normalize(__dirname + '/../../../components'),

  // logs path of server
  logsPath: path.normalize(__dirname + '/../../../logs'),

  // Server port
  port: process.env.PORT || 9000,
  rippleEndpoint: 'https://api.ripple.com/',
  rippleVersion: 'v1/',
  rippledEndpoint: 'ws://54.170.123.85:5006',

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  rippleAccounts: {
    coldBee: {
      address: "rLDfaRrxBZ9RuFiUndwtrzZHkYLTPBL1oC",
      secret: "safgopmsxNtnxA1TMXPPmCSoeQUrF"
    },
    coldGee: {
      address: "rQH8evp6DMQ9FKsyb4rbZPkrZA7g7xEXha",
      secret: "shnfGNinxwmzpwAqASpu2j4wd4PtS"
    },
    activator: {
      address: "rGLVuiRu29e91uzM1rKnj32qqLfuGTuBRg",
      secret: "shSZqmc4QzSaVTgK5taBDV8cxETTf"
    }
  },

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'r-d-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  RIPPLEDDOMAIN: ''
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + process.env.NODE_ENV + '.js') || {});
