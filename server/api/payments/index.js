'use strict';

const express = require('express');
const { validate } = require('express-jsonschema');
const controller = require('./payments.controller');
const schemas = require('./schemas');

var router = express.Router();

router.post('/', validate({body: schemas.createPayment}), controller.createPayment);
router.get('/', controller.listPayment);
router.get('/balances', controller.listBalance);

module.exports = router;
