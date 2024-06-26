const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationMbankServices = require('./authentication-mbank-service');

/** Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function acclogin(request, response, next) {
  const { accemail, accpassword } = request.body;

  try {
    // Check login credentials
    const loginSuccess =
      await authenticationMbankServices.checkLoginCredentials(
        accemail,
        accpassword
      );

    if (!loginSuccess) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  acclogin,
};
//
