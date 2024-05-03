const { User } = require('../../../models');
const {
  logAtt,
  unlockedAt,
  userLocked,
} = require('../../../models/users-schema');
const LOCKEDDURATION = 1800000;

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
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
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  restartLog,
  restartAtt,
  attCounter,
  lockLogin,
};
