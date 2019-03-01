const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  handle: { type: String, required: true },
  captain: { type: Boolean, default: false },
  alreadyGuessed: { type: Boolean, default: false },
  assignedEquationIndex: {tyoe: Number, default: 0 }
});

module.exports = playerSchema;