'use strict';

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  setNumber: {type: Number, required: true},
  gameId: {type: String, required: true},
  equation1: {
    image: {type: Boolean, default: false},
    equation: String,
    answer: Number
  },
  equation2: {
    image: {type: Boolean, default: false},
    equation: String,
    answer: Number
  },
  equation3: {
    image: {type: Boolean, default: false},
    equation: String,
    answer: Number
  },
  equation4: {
    image: {type: Boolean, default: false},
    equation: String,
    answer: Number
  }
});

questionSchema.set('toObject', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
    return ret;
  }
});

module.exports = new mongoose.model('Question', questionSchema);