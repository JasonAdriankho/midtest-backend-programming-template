const mbankService = require('./mbank-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getbankAccs(request, response, next) {
  try {
    const bankAccs = await mbankService.getbankAccs();
    return response.status(200).json(bankAccs);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getbankAcc(request, response, next) {
  try {
    const bankAcc = await mbankService.getbankAcc(request.params.id);

    if (!bankAcc) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown account');
    }

    return response.status(200).json(bankAcc);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function createbankAcc(request, response, next) {
  try {
    const accname = request.body.accname;
    const accemail = request.body.accemail;
    const phoneNum = request.body.phoneNum;
    const accpassword = request.body.accpassword;
    const accpassword_confirm = request.body.accpassword_confirm;

    // Check confirmation password
    if (accpassword !== accpassword_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check if email is already registered
    const isEmailRegistered = await mbankService.accemailIsRegistered(accemail);
    if (isEmailRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await mbankService.createbankAcc(
      accname,
      accemail,
      phoneNum,
      accpassword
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create account'
      );
    }

    return response.status(200).json({ accname, accemail });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updatebankAcc(request, response, next) {
  try {
    const id = request.params.id;
    const accname = request.body.accname;
    const accemail = request.body.accemail;

    // Email must be unique
    const accemailIsRegistered =
      await mbankService.accemailIsRegistered(accemail);
    if (accemailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'email is already registered'
      );
    }

    const success = await mbankService.updatebankAcc(id, accname, accemail);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update account'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deletebankAcc(request, response, next) {
  try {
    const id = request.params.id;

    const success = await mbankService.deletebankAcc(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changebankAccPassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.accpassword_new !== request.body.accpassword_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await mbankService.changebankAccPassword(
        request.params.id,
        request.body.accpassword_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await mbankService.changebankAccPassword(
      request.params.id,
      request.body.accpassword_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getbankAccs,
  getbankAcc,
  createbankAcc,
  updatebankAcc,
  deletebankAcc,
  changebankAccPassword,
};
//
