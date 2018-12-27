'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql');

const GameType = require('./game');
const UserType = require('./user');
const QuestionType = require('./question');

const Game = require('../models/game');
const User = require('../models/user');

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createGame: {
      type: GameType,
      args: {
        title: {type: GraphQLString},
        userId: {type: GraphQLID}
      },
      resolve(parent, args) {
        return;
        // let newQuestions = args.questions.map(question => {
        //   console.log(question);
        // });
        // Game.save();
      }
    },
    createUser: {
      type: UserType,
      args: {
        username: {type: GraphQLString},
        password: {type: GraphQLString},
        email: {type: GraphQLString}
      },
      resolve (parents, args) {
        return User.create({
          username: args.username, 
          password: args.password, 
          email: args.email
        })
          .then(newUser => {
            return newUser;
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  })
});


module.exports = MutationType;