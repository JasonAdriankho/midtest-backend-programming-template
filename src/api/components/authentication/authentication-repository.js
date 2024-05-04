const { User } = require('../../../models');
const LOCKEDDURATION = 1800000;
/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

// fungsi restart login
async function restartLog(id) {
  await User.updateOne(
    { _id: id },
    { $set: { userLocked: false, unlockedAt: 0 } }
  ).catch(() => {});
}

// fungsi restart attempt
async function restartAtt(id) {
  await User.updateOne({ _id: id }, { $set: { logAtt: 0 } }).catch(() => {});
}

// fungsi penghitung attempt
async function attCounter(id) {
  await User.updateOne({ _id: id }, { $inc: { logAtt: 1 } }).catch(() => {});
}

// fungsi penguncian akun
async function lockLogin(id) {
  const lockedTime = new Date().getTime() + LOCKEDDURATION;
  await User.updateOne(
    { _id: id },
    { $set: { userLocked: true, unlockedAt: lockedTime } }
  ).catch(() => {});
}

module.exports = {
  getUserByEmail,
  restartAtt,
  attCounter,
  restartLog,
  lockLogin,
};
