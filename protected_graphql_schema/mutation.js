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
        return Question.findByIdAndUpdate(args.questionId, args.questionObject, {new: true})
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
            console.log('New Question: ', newQuestion);
            return newQuestion;
          })
          .catch(err => {
            throw err;
          });
      }
    }
  })
});


module.exports = MutationType;