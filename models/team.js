const mongoose = require('mongoose');

const playerSchema = require('./player');

const teamSchema = mongoose.Schema({
  teamName: { type: String, required: true },
  points: { type: Number, default: 0 },
  currentQuestion: { type: Number, default: 0 },
  players: [ {type: playerSchema, default: []} ]
});

module.exports = teamSchema;