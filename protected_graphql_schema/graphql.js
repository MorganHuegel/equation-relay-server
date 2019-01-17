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

const { UserType } = require('./user');
const GameType = require('./game');
const QuestionType = require('./question');
const Mutation = require('./mutation');


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: {},
      resolve (parent, args, context) {
        const { userId } = context;
        return User.findById(userId)
          .then(userData => {
            if (!userData) {
              return Promise.reject(new Error('User ID from jsonwebtoken does not exist.'));
            }
            return userData;
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