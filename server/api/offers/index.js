'use strict';

const express = require('express');
const { validate } = require('express-jsonschema');
const controller = require('./offers.controller');
const schemas = require('./schemas');

var router = express.Router();

router.post('/', validate({body: schemas.createOrder}), controller.createOrder);

module.exports = router;
