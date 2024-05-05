const { bankAcc } = require('../../../models');

/**Get user by email for login information
 * @param {string} accemail - Account Email
 * @returns {Promise}
 */
async function getbankAccByEmail(accemail) {
  return bankAcc.findOne({ accemail });
}

module.exports = {
  getbankAccByEmail,
};
//
