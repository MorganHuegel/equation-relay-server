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


module.exports = UserType;