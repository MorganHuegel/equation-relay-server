const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  teamName: { type: String, required: true },
  points: { type: Number, default: 0 },
  currentQuestion: { type: Number, default: 1 }
});

module.exports = teamSchema;