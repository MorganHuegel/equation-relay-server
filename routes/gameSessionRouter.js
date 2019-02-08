const express = require('express');

const gameSessionRouter = express.Router();

const GameSession = require('../models/gameSession');

gameSessionRouter.get('/:sessionCode', (req, res) => {
  const sessionCode = req.params.sessionCode;
  return GameSession.findOne({sessionCode})
    .then(sessionData => {
      if (!sessionData) {
        return Promise.reject({message: `Game session ${sessionCode} does not exist.`});
      } else {
        return res.status(200).json(sessionData);
      }
    })
    .catch(err => {
      return res.status(404).json({message: err.message});
    });
});

module.exports = { gameSessionRouter };