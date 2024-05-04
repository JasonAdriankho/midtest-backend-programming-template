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
      noRek: bankAcc.noRek,
      accname: bankAcc.accname,
      accemail: bankAcc.accemail,
    });
  }

  return results;
}

/**
 * Get bank account detail
 * @param {string} noRek - noRek
 * @returns {Object}
 */
async function getbankAcc(noRek) {
  const bankAcc = await mbankRepository.getbankAcc(noRek);

  // Bank Account not found
  if (!bankAcc) {
    return null;
  }

  return {
    noRek: bankAcc.noRek,
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
async function createbankAcc(accname, accemail, accpassword) {
  // Hash password
  const hashedPassword = await hashPassword(accpassword);

  try {
    await mbankRepository.createbankAcc(accname, accemail, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing bank account
 * @param {string} noRek - noRek
 * @param {string} accname - Account Name
 * @param {string} accemail - Account Email
 * @returns {boolean}
 */
async function updatebankAcc(noRek, accname, accemail) {
  const bankAcc = await mbankRepository.getbankAcc(noRek);

  // Bank Account not found
  if (!bankAcc) {
    return null;
  }

  try {
    await mbankRepository.updatebankAcc(noRek, accname, accemail);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete bank account
 * @param {string} noRek - noRek
 * @returns {boolean}
 */
async function deletebankAcc(noRek) {
  const bankAcc = await mbankRepository.getbankAcc(noRek);

  // Bank Account not found
  if (!bankAcc) {
    return null;
  }

  try {
    await mbankRepository.deletebankAcc(noRek);
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
 * @param {string} bankAccnoRek - bankAcc noRek
 * @param {string} accpassword - Account Password
 * @returns {boolean}
 */
async function bankAcccheckPassword(bankAccnoRek, accpassword) {
  const bankAcc = await mbankRepository.getbankAcc(bankAccnoRek);
  return passwordMatched(accpassword, bankAcc.accpassword);
}

/**
 * Change user password
 * @param {string} bankAccnoRek - bankAcc noRek
 * @param {string} accpassword - Account Password
 * @returns {boolean}
 */
async function bankAccchangePassword(bankAccnoRek, accpassword) {
  const bankAcc = await mbankRepository.getbankAcc(bankAccnoRek);

  // Check if Bank Account not found
  if (!bankAcc) {
    return null;
  }

  const hashedPassword = await hashPassword(accpassword);

  const changeSuccess = await mbankRepository.bankAccchangePassword(
    bankAccnoRek,
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
  bankAccchangePassword,
};
