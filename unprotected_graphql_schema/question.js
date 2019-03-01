'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
} = require('graphql');

const EquationType = new GraphQLObjectType({
  name: 'Equation',
  fields: () => ({
    id: {type: GraphQLID},
    image: {type: GraphQLBoolean},
    equation: {type: GraphQLString},
    answer: {type: GraphQLInt}
  })
});

const QuestionType = new GraphQLObjectType({
  name: 'Question',
  fields: () => ({
    id: {type: GraphQLID},
    gameId: {type: GraphQLID},
    setNumber: {type: GraphQLInt},
    equation1: {type: EquationType},
    equation2: {type: EquationType},
    equation3: {type: EquationType},
    equation4: {type: EquationType}
  })
});

module.exports = QuestionType;