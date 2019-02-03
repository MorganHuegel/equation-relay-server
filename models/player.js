const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  handle: { type: String, required: true },
  captain: { type: Boolean, default: false },
});

module.exports = playerSchema;