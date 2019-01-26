'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const { QuestionType } = require('./question');
const Question = require('../models/question');

const GameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    description: {type: GraphQLString},
    userId: {type: GraphQLID},
    playCount: {type: GraphQLInt},
    questions: {
      type: new GraphQLList(QuestionType),
      resolve(parent, args){
        return Question.find({gameId: parent.id});
      }
    },
    numOfQuestions: {
      type: GraphQLInt,
      resolve(parent, args) {
        return Question.count({gameId: parent.id});
      }
    }
  })
});

module.exports = GameType;