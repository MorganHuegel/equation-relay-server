'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInputObjectType
} = require('graphql');

const EquationType = new GraphQLObjectType({
  name: 'Equation',
  fields: () => ({
    image: {type: GraphQLBoolean},
    equation: {type: GraphQLString},
    answer: {type: GraphQLInt}
  })
});

const EquationInput = new GraphQLInputObjectType({
  name: 'EquationInput',
  fields: () => ({
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

const QuestionInput = new GraphQLInputObjectType({
  name: 'QuestionInput',
  fields: () => ({
    equation1: {type: EquationInput},
    equation2: {type: EquationInput},
    equation3: {type: EquationInput},
    equation4: {type: EquationInput},
    setNumber: {type: GraphQLInt},
    gameId: {type: GraphQLID}
  })
});

module.exports = { QuestionType, QuestionInput };