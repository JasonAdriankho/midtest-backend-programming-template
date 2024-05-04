const bcrypt = require('bcrypt');

//////////////////////////////////////////////////////////////////////////////////
/**
 * Hash a plain text password
 * @param {string} accpassword - The password to be hashed
 * @returns {string}
 */
async function hashPassword(accpassword) {
  const saltRounds = 16;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(accpassword, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPassword;
}

/////////////////////////////////////////////////////////////////////////////////
/**
 * Compares a plain text password and its hashed to determine its equality
 * Mainly use for comparing login credentials
 * @param {string} accpassword - A plain text accpassword
 * @param {string} hashedPassword - A hashed accpassword
 * @returns {boolean}
 */
async function passwordMatched(accpassword, hashedPassword) {
  return bcrypt.compareSync(accpassword, hashedPassword);
}

module.exports = {
  hashPassword,
  passwordMatched,
};
