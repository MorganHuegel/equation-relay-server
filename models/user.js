'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  games: {type: [String], default: []},
  favorites: {type: [String], default: []}
});

userSchema.set('toObject', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
    return ret;
  }
});

module.exports = new mongoose.model('User', userSchema);