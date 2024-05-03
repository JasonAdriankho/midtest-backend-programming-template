const { bankAcc } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getbankAccs() {
  return bankAcc.find({});
}

/**
 * Get user detail
 * @param {string} noRek - noRek
 * @returns {Promise}
 */
async function getbankAcc(noRek) {
  return bankAcc.findBynoRek(noRek);
}

/**
 * Create new Account
 * @param {string} accname - Account Name
 * @param {string} accemail - Account Email
 * @param {string} phoneNum - Account Phone Number
 * @param {string} accpassword - Account Hashed password
 * @returns {Promise}
 */
async function createbankAcc(accname, accemail, phoneNum, accpassword) {
  return bankAcc.create({
    accname,
    accemail,
    phoneNum,
    accpassword,
  });
}

/**
 * Update existing user
 * @param {string} noRek - Account noRek
 * @param {string} accname - Account Name
 * @param {string} accemail - Account Email
 * @returns {Promise}
 */
async function updatebankAcc(noRek, accname, accemail) {
  return bankAcc.updateOne(
    {
      _noRek: noRek,
    },
    {
      $set: {
        accname,
        accemail,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} noRek - Account noRek
 * @returns {Promise}
 */
async function deletebankAcc(bankAcc) {
  return bankAcc.deleteOne({ _noRek: noRek });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} accemail - Account Email
 * @returns {Promise}
 */
async function getbankAccByEmail(accemail) {
  return bankAcc.findOne({ accemail });
}

/**
 * Update user password
 * @param {string} noRek - Account noRek
 * @param {string} accpassword - New hashed password
 * @returns {Promise}
 */
async function changebankAccPassword(noRek, accpassword) {
  return bankAcc.updateOne({ _noRek: noRek }, { $set: { accpassword } });
}

module.exports = {
  getbankAccs,
  getbankAcc,
  createbankAcc,
  updatebankAcc,
  deletebankAcc,
  getbankAccByEmail,
  changebankAccPassword,
};
