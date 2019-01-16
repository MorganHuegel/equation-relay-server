'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql');

const Game = require('../models/game');

const GameSchema = require('./game');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    username: {type: GraphQLString},
    password: {type: GraphQLString},
    email: {type: GraphQLString},
    games: {
      type: new GraphQLList(GameSchema),
      resolve(parent, args){
        return Game.find({userId: parent.id});
      }
    }
  })
});

function validateCreateUser (username, password, email) {
  if (!username) {
    const err = new Error('Request does not have a username.');
    err.status = 400;
    throw err;
  }

  if (password.length < 8) {
    const err = new Error('Password must be at least 8 characters');
    err.status = 400;
    throw err;
  }

  if (!email.match(/[0-9a-zA-Z]{1,}@[0-9a-zA-Z]{1,}\.[a-zA-Z]{1,}/)) {
    const err = new Error('Email is not valid.');
    err.status = 400;
    throw err;
  }

  return true;
}

module.exports = { UserType, validateCreateUser };