'use strict';

var express = require('express');
const { validate } = require('express-jsonschema');
var controller = require('./users.controller');
const schemas = require('./schemas');

var router = express.Router();

router.get('/', controller.list);
router.post('/', validate({body: schemas.createUser}), controller.create);
router.get('/test', controller.test);

module.exports = router;
