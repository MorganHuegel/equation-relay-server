'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList
} = require('graphql');

const User = require('../models/user');
const Game = require('../models/game');
const Question = require('../models/question');

const UserType = require('./user');
const GameType = require('./game');
const QuestionType = require('./question');
const Mutation = require('./mutation');


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve (parent, args) {
        return User.findById(args.id);
      }
    },
    game: {
      type: GameType,
      args: {gameId: {type: GraphQLID}},
      resolve (parent, args) {
        return Game.findById(args.gameId);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve (parent, args) {
        return User.find();
      }
    },
    games: {
      type: new GraphQLList(GameType),
      resolve (parent, args) {
        return Game.find();
      }
    },
    question: {
      type: new GraphQLList(QuestionType),
      args: {
        gameId: {type: GraphQLID}
      },
      resolve(parent, args){
        return ['Hi'];
      }
    }
  })
});


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});