const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const mbankController = require('./mbank-controller');
const mbankValidator = require('./mbank-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/mbank', route);

  //   // Get list of users
  route.get('/', authenticationMiddleware, mbankController.getbankAccs);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(mbankValidator.createbankAcc),
    mbankController.createbankAcc
  );

  // Get user detail
  route.get('/:noRek', authenticationMiddleware, mbankController.getbankAcc);

  // Update user
  route.put(
    '/:noRek',
    authenticationMiddleware,
    celebrate(mbankValidator.updatebankAcc),
    mbankController.updatebankAcc
  );

  // Delete user
  route.delete(
    '/:noRek',
    authenticationMiddleware,
    mbankController.deletebankAcc
  );
  1;

  // Change password
  route.post(
    '/:noRek/changebankAcc-password',
    authenticationMiddleware, //
    celebrate(mbankValidator.changebankAccPassword),
    mbankController.changebankAccPassword
  );
};
