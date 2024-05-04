const joi = require('joi');

module.exports = {
  login: {
    body: {
      accemail: joi.string().email().required().label('Account Email'),
      accpassword: joi.string().required().label('Account Password'),
    },
  },
};
