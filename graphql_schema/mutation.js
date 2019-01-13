'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql');
const bcrypt = require('bcryptjs');

const GameType = require('./game');
const { UserType, validateCreateUser } = require('./user');
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
        validateCreateUser(args.username, args.password, args.email);
        return bcrypt.genSalt(8)
          .then(salt => bcrypt.hash(args.password, salt))
          .then(encryptedPassword => {
            return User.create({
              username: args.username,
              password: encryptedPassword, 
              email: args.email
            });
          })
          .then(newUser => {
            return newUser;
          })
          .catch(err => {
            if (err.code === 11000) {
              const e = new Error('That username or email already exists');
              e.status = 400;
              throw e;
            } else {
              throw err;
            }
          });
      }
    }
  })
});


module.exports = MutationType;