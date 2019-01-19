'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql');

const GameType = require('./game');
const { UserType, validateCreateUser } = require('./user');
const QuestionType = require('./question');

const Game = require('../models/game');
const User = require('../models/user');

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createGame: {
      type: GameType,
      args: {
        title: {type: GraphQLString},
        description: {type: GraphQLString}
      },
      resolve(parent, args, context) {
        //context is the request object
        const { userId } = context;
        const { title, description } = args;

        return Game.create({ userId, title, description })
          .then(gameInfo => {
            return gameInfo;
          })
          .catch(err => {
            throw err;
          });
      }
    }
  })
});


module.exports = MutationType;