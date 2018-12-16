'use strict';

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {type: String, required: true},
  userId: {type: String, required: true},
  questions: [String],
  playCount: {type: Number, default: 0}
});

gameSchema.set('toObject', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
    return ret;
  }
});

module.exports = new mongoose.model('Game', gameSchema);