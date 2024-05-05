const mbankRepository = require('./mbank-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { phoneNum } = require('../../../models/mbanks-Schema');

/**
 * Get list of bank accounts
 * @returns {Array}
 */
async function getbankAccs() {
  const bankAccs = await mbankRepository.getbankAccs();

  const results = [];
  for (let i = 0; i < bankAccs.length; i += 1) {
    const bankAcc = bankAccs[i];
    results.push({
      id: bankAcc.id,
      accname: bankAcc.accname,
      accemail: bankAcc.accemail,
      phoneNum: bankAcc.phoneNum,
    });
  }

  return results;
}

/**
 * Get bank account detail
 * @param {string} id - Account id
 * @returns {Object}
 */
async function getbankAcc(id) {
  const bankAcc = await mbankRepository.getbankAcc(id);

  // Bank Account not found
  if (!bankAcc) {
    return null;
  }

  return {
    id: bankAcc.id,
    accname: bankAcc.accname,
    accemail: bankAcc.accemail,
  };
}

/**
 * Create new bank Account
 * @param {string} accname - Account Name
 * @param {string} accemail - Account Email
 * @param {string} phoneNum - Account Phone Number
 * @param {string} accpassword - Account Password
 * @returns {boolean}
 */
async function createbankAcc(accname, accemail, phoneNum, accpassword) {
  // Hash password
  const hashedPassword = await hashPassword(accpassword);

  try {
    await mbankRepository.createbankAcc(
      accname,
      accemail,
      phoneNum,
      hashedPassword
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing bank account
 * @param {string} id - Account id
 * @param {string} accname - Account Name
 * @param {string} accemail - Account Email
 * @returns {boolean}
 */
async function updatebankAcc(id, accname, accemail) {
  const bankAcc = await mbankRepository.getbankAcc(id);

  // Bank Account not found
  if (!bankAcc) {
    return null;
  }

  try {
    await mbankRepository.updatebankAcc(id, accname, accemail);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete bank account
 * @param {string} id - Account id
 * @returns {boolean}
 */
async function deletebankAcc(id) {
  const bankAcc = await mbankRepository.getbankAcc(id);

  // Bank Account not found
  if (!bankAcc) {
    return null;
  }

  try {
    await mbankRepository.deletebankAcc(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the account email is registered
 * @param {string} accemail - Account Email
 * @returns {boolean}
 */
async function accemailIsRegistered(accemail) {
  const bankAcc = await mbankRepository.getbankAccByEmail(accemail);

  if (bankAcc) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} bankAccid - bankAcc id
 * @param {string} accpassword - Account Password
 * @returns {boolean}
 */
async function bankAcccheckPassword(id, accpassword) {
  const bankAcc = await mbankRepository.getbankAcc(id);
  return passwordMatched(accpassword, bankAcc.accpassword);
}

/**
 * Change user password
 * @param {string} bankAccid - bankAcc id
 * @param {string} accpassword - Account Password
 * @returns {boolean}
 */
async function changebankAccPassword(bankAccid, accpassword) {
  const bankAcc = await mbankRepository.getbankAcc(bankAccid);

  // Check if Bank Account not found
  if (!bankAcc) {
    return null;
  }

  const hashedPassword = await hashPassword(accpassword);

  const changeSuccess = await mbankRepository.changebankAccPassword(
    bankAccid,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getbankAccs,
  getbankAcc,
  createbankAcc,
  updatebankAcc,
  deletebankAcc,
  accemailIsRegistered,
  bankAcccheckPassword,
  changebankAccPassword,
};
//
