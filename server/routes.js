/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import middlewares from './config/middlewares';

export default function(app) {
  // Insert routes below
  app.use('/api/users', require('./api/users'));
  app.use('/api/offers', require('./api/offers'));
  app.use('/api/payments', require('./api/payments'));
  app.use('/api/transactions', require('./api/transactions'));
  app.use('/api/trustlines', require('./api/trustlines'));

  app.use(middlewares.jsonSchemaValidation('JsonSchemaValidation'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
