'use strict';

function validateCreateUser (username, password, email) {
  if (!username) {
    const err = new Error('Request does not have a username.');
    err.status = 400;
    throw err;
  }

  if (password.length < 8) {
    const err = new Error('Password must be at least 8 characters');
    err.status = 400;
    throw err;
  }

  if (!email.match(/[0-9a-zA-Z]{1,}@[0-9a-zA-Z]{1,}\.[a-zA-Z]{1,}/)) {
    const err = new Error('Email is not valid.');
    err.status = 400;
    throw err;
  }

  return true;
}

module.exports = { validateCreateUser };