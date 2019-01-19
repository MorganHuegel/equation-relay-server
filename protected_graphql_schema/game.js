'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const QuestionSchema = require('./question');
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
      type: new GraphQLList(QuestionSchema),
      resolve(parent, args){
        return Question.find({gameId: parent.id});
      }
    }
  })
});

module.exports = GameType;