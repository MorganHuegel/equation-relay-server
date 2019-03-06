'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLString
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
        if (!args.gameId) {
          throw new Error('Must provide a game ID to fetch game data.');
        }

        return Game.findById(args.gameId)
          .then(gameData => {
            return gameData;
          })
          .catch(err => {
            throw err;
          });
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
      type: QuestionType,
      args: {
        gameId: { type: GraphQLString },
        questionIndex: { type: GraphQLInt }
      },
      resolve(parent, args){
        return Game.findById(args.gameId).populate('questions')
          .then(gameData => {
            if (gameData.questions.length <= args.questionIndex) {
              return null;
            }
            return gameData.questions[args.questionIndex];
          })
          .catch(err => {
            throw err;
          });
      }
    }
  })
});


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});