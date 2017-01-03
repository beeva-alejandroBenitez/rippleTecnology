/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import errorHandler from 'errorhandler';
import path from 'path';
import config from './environment';

export default function (app) {
  var env = app.get('env');
  
  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
  }
  
  if (env === 'production') {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
  }
  
  app.set('appPath', path.join(config.root, 'client'));
  app.use(express.static(app.get('appPath')));
  app.use(morgan('dev'));
  
  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  
  if ('development' === env) {
    app.use(require('connect-livereload')({
      ignore: [
        /^\/api\/(.*)/,
        /\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/,
        /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/
      ]
    }));
  }
  
  if ('development' === env || 'test' === env) {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
