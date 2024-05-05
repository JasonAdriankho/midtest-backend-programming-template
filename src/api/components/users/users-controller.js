const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { round, ceil } = require('lodash');
const usersRoute = require('./users-route');
// const express = require('express');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    let users = await usersService.getUsers();
    const page_size = parseInt(request.query.page_size);
    const page_number = parseInt(request.query.page_number);
    const sort = request.query.sort;
    const search = request.query.search;

    // Fungsi untuk sorting data berdasarkan parameter yang telah diberikan.
    function sortUsersEmail(users, sort) {
      const [field, order] = sort.split(':');
      let sortedUsersbyEmail = [...users];

      let i = 0;
      let sorted = false;
      while (!sorted) {
        sorted = true;
        for (let a = 0; a < sortedUsersbyEmail.length - 1 - i; a++) {
          if (
            (order === 'asc' &&
              sortedUsersbyEmail[a][field] >
                sortedUsersbyEmail[a + 1][field]) ||
            (order === 'desc' &&
              sortedUsersbyEmail[a][field] < sortedUsersbyEmail[a + 1][field])
          ) {
            [sortedUsersbyEmail[a], sortedUsersbyEmail[a + 1]] = [
              sortedUsersbyEmail[a + 1],
              sortedUsersbyEmail[a],
            ];
            sorted = false;
          }
        }
        i++;
      }

      return sortedUsersbyEmail;
    }

    // Fungsi untuk search data berdasarkan parameter.
    function searchUsersEmail(users, search) {
      const [field, key] = search.split(':');
      const lowerKey = key.toLowerCase();

      let result = [];
      let b = 0;
      while (b < users.length) {
        const fieldValue = users[b][field].toLowerCase();
        if (fieldValue.includes(lowerKey)) {
          result.push(users[b]);
        }
        b++;
      }

      return result;
    }

    search && (users = searchUsersEmail(users, search));
    sort && (users = sortUsersEmail(users, sort));

    const startIndex = (page_number - 1) * page_size;
    const endIndex = page_number * page_size;

    // Pagination
    const data = {};

    data.page_number = page_number; // Show current page
    data.page_size = page_size; // Show current page maximum data storage
    data.count = users.length; // Show all data count
    data.total_pages = ceil(data.count / page_size); // Show total pages, use ceil to round up the total pages counting
    data.has_previous_page = page_number > 1; // Show true or false for has previous page statement
    data.has_next_page = data.total_pages > data.page_number; // Show true or false for has next page statement

    data.data = users.slice(startIndex, endIndex);
    response.json(data);

    return response.status(200).json(users);
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
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
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
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
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
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
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
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
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
async function changePassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await usersService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await usersService.changePassword(
      request.params.id,
      request.body.password_new
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
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
//
