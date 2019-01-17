'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql');

const GameType = require('./game');
const { UserType, validateCreateUser } = require('./user');
const QuestionType = require('./question');

const Game = require('../models/game');
const User = require('../models/user');

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createGame: {
      type: GraphQLString,
      args: {
        title: {type: GraphQLString}
      },
      resolve(parent, args, context) {
        //context is the request object
        const { username, userId } = context;
        
        return 'response';
        // let newQuestions = args.questions.map(question => {
        //   console.log(question);
        // });
        // Game.save();
      }
    }
  })
});


module.exports = MutationType;