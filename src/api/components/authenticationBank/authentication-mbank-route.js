const express = require('express');

const authenticationMbankControllers = require('./authentication-mbank-controller');
const authenticationMbankValidators = require('./authentication-mbank-validator');
const celebrate = require('../../../core/celebrate-wrappers');

const route = express.Router();

module.exports = (app) => {
  app.use('/authenticationBank', route);

  route.post(
    '/acclogin',
    celebrate(authenticationMbankValidators.acclogin),
    authenticationMbankControllers.acclogin
  );
};
//
