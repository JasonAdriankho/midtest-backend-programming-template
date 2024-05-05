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
 * @param {string} id - id
 * @returns {Promise}
 */
async function getbankAcc(id) {
  return bankAcc.findById(id);
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
 * @param {string} id - Account id
 * @param {string} accname - Account Name
 * @param {string} accemail - Account Email
 * @returns {Promise}
 */
async function updatebankAcc(id, accname, accemail) {
  return bankAcc.updateOne(
    {
      _id: id,
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
 * @param {string} id - Account id
 * @returns {Promise}
 */
async function deletebankAcc(id) {
  return bankAcc.deleteOne({ _id: id });
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
 * @param {string} id - Account id
 * @param {string} accpassword - New hashed password
 * @returns {Promise}
 */
async function changebankAccPassword(id, accpassword) {
  return bankAcc.updateOne({ _id: id }, { $set: { accpassword } });
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
