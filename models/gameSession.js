const mongoose = require('mongoose');

const playerSchema = require('./player');
const teamSchema = require('./team');

const gameSessionSchema = new mongoose.Schema({
  leader: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
  sessionCode: { type: String, required: true, unique: true },
  gameId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Game', required: true },
  playerList: [ { type: playerSchema, default: [] } ],
  teamList: [ { type: teamSchema, default: [] } ],
  startedGame: { type: Boolean, default: false },
  endedGame: { type: Boolean, default: false }
});

const GameSession = new mongoose.model('GameSession', gameSessionSchema);

function generateSessionCode (sessionCode = null) {
  if (!sessionCode) {
    sessionCode = (Math.random() * 10).toFixed(2).toString().replace('.', '');
  } else {
    sessionCode = (Number(sessionCode) + 1).toString();
    while (sessionCode.length < 3) {
      sessionCode = '0' + sessionCode;
    }
  }

  return GameSession.findOne({sessionCode})
    .then(result => {
      if (result) {
        return generateSessionCode(sessionCode);
      } else {
        return sessionCode;
      }
    })
    .catch(err => {
      throw err;
    });
}

module.exports = { GameSession, generateSessionCode };