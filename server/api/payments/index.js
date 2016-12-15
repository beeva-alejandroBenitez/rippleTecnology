'use strict';

import {Router} from 'express';
import * as controller from './payments.controller';

var router = new Router();

router.get('/preparePayments', controller.preparePayments);
router.get('/submitPayments', controller.submitPayments);

module.exports = router;
