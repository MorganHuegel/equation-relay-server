const mongoose = require('mongoose');

const playerSchema = require('./player');
const teamSchema = require('./team');

const gameSessionSchema = new mongoose.Schema({
  leader: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
  sessionCode: { type: String, required: true },
  gameId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Game', required: true },
  playerList: [ { type: playerSchema, default: [] } ],
  teamList: [ { type: teamSchema, default: [] } ]
});

module.exports = new mongoose.model('GameSession', gameSessionSchema);