'use strict';

const express = require('express');
const { validate } = require('express-jsonschema');
const controller = require('./trustlines.controller.js');
const schemas = require('./schemas');

var router = express.Router();

router.post('/', validate({body: schemas.createTrustline}), controller.createTrustline);
router.get('/', controller.listTrustline);

module.exports = router;
