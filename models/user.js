'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  games: [String],
  favorites: [String]
});

userSchema.set('toObject', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret.password;
    delete ret._id;
    return ret;
  }
});

module.exports = new mongoose.model('User', userSchema);