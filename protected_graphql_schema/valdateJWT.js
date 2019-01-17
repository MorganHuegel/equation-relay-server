'use strict';

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_SECRET } = require('../config');

function validateJWTMiddleware (req, res, next) {
  const token = req.headers.authorization;
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.json({data: {errors: [err]}});
    } else if (!mongoose.Types.ObjectId.isValid(payload.id)) {
      const e = new Error('ID in jsonwebtoken payload is not a valid Mongoose ID');
      return res.json({data: {errors: [e]}});
    } else {
      req.username = payload.username;
      req.userId = payload.id;
      return next();
    }
  });
}

module.exports = { validateJWTMiddleware };