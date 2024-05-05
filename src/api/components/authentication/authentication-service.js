const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { toInteger } = require('lodash');
const { userLocked } = require('../../../models/users-schema');
/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  if (!user) {
    return null;
  }

  const currentTime = new Date().getTime();
  const TimeToUnlock = toInteger((user.unlockedAt - currentTime) / 60 / 1000);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  while (TimeToUnlock <= 0 && user.userLocked) {
    await authenticationRepository.restartLog(user.id);
    await authenticationRepository.restartAtt(user.id);

    return {
      message:
        'Timer 30 menit sudah berlalu, anda dapat mencoba untuk login kembali, dan pastikan password dan email and benar.',
    };
  }

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.

  try {
    if (!user) {
      throw errorResponder(errorTypes.NOT_FOUND, `User not found.`);
    }

    // Show that the user account / email is locked for 30 mins
    if (user.userLocked) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        ` User ${user.email} is locked please try again at ${TimeToUnlock} minutes`
      );
    }

    // Tell the user that the account ahs been locked, because the login attempt has reach the max
    if (user.logAtt >= 4) {
      await authenticationRepository.lockLogin(user.id);
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `Current Attempts Has Reached ${user.logAtt + 1} Account is locked`
      );
    }

    // Counting the current failed attempt and displaying it
    if (!passwordChecked) {
      const userId = user.id;
      await authenticationRepository.attCounter(userId);
      const currentAtt = user.logAtt + 1;
      const errorMessage = `Incorrect Password. Current Attempts: ${currentAtt}`;
      throw errorResponder(errorTypes.INVALID_PASSWORD, errorMessage);
    }

    // If password is correct, then user will be able to login
    // Login Attempt will be reset
    await authenticationRepository.restartAtt(user.id);

    // Display email, name, user_id, token. If user login successfully
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } catch (error) {
    `Error during authentication: ${error}`;
    throw error;
  }
}

module.exports = {
  checkLoginCredentials,
};
//
