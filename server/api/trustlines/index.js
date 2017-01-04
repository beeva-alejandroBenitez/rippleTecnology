'use strict';

const express = require('express');
const { validate } = require('express-jsonschema');
const controller = require('./trustlines.controller.js');
const schemas = require('../../schemas/trustline.schema');

var router = express.Router();

router.post('/', validate({body: schemas.createTrustline}), controller.createTrustline);

module.exports = router;
