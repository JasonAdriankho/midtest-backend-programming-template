const authenticationMbankRepository = require('./authentication-mbank-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/accpassword');

/**Check username and password for login.
 * @param {string} accemail - Account Email
 * @param {string} accpassword - Account Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(accemail, accpassword) {
  const bankAcc =
    await authenticationMbankRepository.getbankAccByEmail(accemail);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const bankAccPassword = bankAcc
    ? bankAcc.accpassword
    : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(accpassword, bankAccPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the user is found (by email) and
  // the password matches.
  if (bankAcc && passwordChecked) {
    return {
      accemail: bankAcc.accemail,
      accname: bankAcc.accname,
      bankAcc_noRek: bankAcc.noRek,
      token: generateToken(bankAcc.accemail, bankAcc.noRek),
    };
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
};
