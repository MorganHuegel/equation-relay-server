'use strict';

const mongoose = require('mongoose');
const { DB_URL } = require('../config');

const User = require('../models/user');
const Game = require('../models/game');
const Question = require('../models/question');

const DummyUsers = require('./dummy-users.json');
const DummyGames = require('./dummy-games.json');
const DummyQuestions = require('./dummy-questions.json');

mongoose.connect(DB_URL, error => {
  if (error) {
    console.error('ERROR: ', error);
  }

  return mongoose.connection.dropDatabase()
    .then(() => User.insertMany(DummyUsers))
    .then(dbResponse => {
      console.log(dbResponse);
      return Game.insertMany(DummyGames);
    })
    .then(dbResponse => {
      console.log(dbResponse);
      return Question.insertMany(DummyQuestions);
    })
    .then(dbResponse => {
      console.log(dbResponse);
      return mongoose.disconnect();
    })
    .catch(err => console.error(err));
});