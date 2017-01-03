'use strict';

const express = require('express');
const { validate } = require('express-jsonschema');
const controller = require('./transactions.controller');
const schemas = require('./schemas');

var router = express.Router();

router.get('/', validate({query: schemas.retrieveTransaction}), controller.retrieveTransaction);

module.exports = router;
