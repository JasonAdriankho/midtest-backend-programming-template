const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const mbank = require('./components/mbank/mbank-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  mbank(app);

  return app;
};
