'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} = require('graphql');

const GameType = require('./game');
const { UserType, validateCreateUser } = require('./user');
const { QuestionType, QuestionInput } = require('./question');

const Game = require('../models/game');
const User = require('../models/user');
const Question = require('../models/question');

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
        let { title, description } = args;
        if (!description) {
          description = 'No description';
        }

        return Game.create({ userId, title, description })
          .then(gameInfo => {
            return gameInfo;
          })
          .catch(err => {
            throw err;
          });
      }
    },

    updateQuestion: {
      type: QuestionType,
      args: {
        questionId: {type: GraphQLString},
        questionObject: {type: QuestionInput}
      },
      resolve(parents, args, context) {
        const userIdFromToken = context.userId;
        return Game.findOne({userId: userIdFromToken, _id: args.gameId})
          .then(validGame => {
            if (validGame) {
              return Question.findByIdAndUpdate(args.questionId, args.questionObject, {new: true});
            } else {
              return Promise.reject(new Error(`Game with id ${args.gameId} for user ${userIdFromToken} does not exist.`));
            }
          })
          .then(updatedQuestion => {
            return updatedQuestion;
          })
          .catch(err => {
            throw err;
          });
      }
    },

    createQuestion: {
      type: QuestionType,
      args: {
        questionObject: {type: QuestionInput}
      },
      resolve(parents, args, context) {
        return Question.create(args.questionObject)
          .then(newQuestion => {
            return newQuestion;
          })
          .catch(err => {
            throw err;
          });
      }
    },

    deleteGame: {
      type: GraphQLString,
      args: {
        gameId: {type: GraphQLID}
      },
      resolve(parents, args, context){
        const userIdFromToken = context.userId;
        return Game.findOne({userId: userIdFromToken, _id: args.gameId})
          .then(validGame => {
            if (validGame) {
              return Game.findByIdAndDelete(args.gameId);
            } else {
              return Promise.reject(new Error(`Game with id ${args.gameId} for user ${userIdFromToken} does not exist.`));
            }
          })
          .then(deletedQuestion => {
            if (!deletedQuestion) {
              return Promise.reject(new Error(`Game with ID ${args.gameId} was not deleted.`));
            }
            return 'Successfully deleted Game ' + args.gameId;
          })
          .catch(err => {
            throw err;
          });
      }
    }
  })
});


module.exports = MutationType;