'use strict';

function validateLoginUser (username, password) {
  if (!username) {
    const err = new Error('Request does not have a username or email.');
    err.status = 400;
    throw err;
  }

  if (password.length < 8) {
    const err = new Error('Password must be at least 8 characters');
    err.status = 400;
    throw err;
  }

  return true;
}

module.exports = { validateLoginUser };