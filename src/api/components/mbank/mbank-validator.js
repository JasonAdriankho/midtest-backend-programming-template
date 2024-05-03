const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createbankAcc: {
    body: {
      accname: joi.string().min(1).max(100).required().label('Account Name'),
      accemail: joi.string().email().required().label('Account Email'),
      phoneNum: joi
        .string()
        .min(10)
        .max(15)
        .required()
        .label('Account Phone Number'),
      accpassword: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('Account Password'),
      accpassword_confirm: joi
        .string()
        .required()
        .label('Password confirmation'),
    },
  },

  updatebankAcc: {
    body: {
      accname: joi.string().min(1).max(100).required().label('Account Name'),
      accemail: joi.string().email().required().label('Account Email'),
    },
  },

  bankAccchangePassword: {
    body: {
      accpassword_old: joi.string().required().label('Old password'),
      accpassword_new: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('New Account password'),
      accpassword_confirm: joi
        .string()
        .required()
        .label('Password confirmation'),
    },
  },
};
