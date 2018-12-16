'use strict';

const {
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType
} = require('graphql');


const User = require('../models/user');
const Game = require('../models/game');
const Question = require('../models/question');


const RootQuery = {hello: () => 'Hello World'};

module.exports = {
  graphqlSchema: new GraphQLSchema({
    query: RootQuery
  })
};