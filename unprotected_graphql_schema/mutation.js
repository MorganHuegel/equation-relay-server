'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const GameType = require('./game');
const UserType = require('./user');
const QuestionType = require('./question');

const { validateCreateUser } = require('../validators/createUserValidation');
const { validateLoginUser } = require('../validators/loginUserValidation');
const { JWT_SECRET } = require('../config');

const Game = require('../models/game');
const User = require('../models/user');

const MutationType = new GraphQLObjectType({
  name: 'Mutation',

  fields: () => ({

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
    },


    loginUser: {
      type: GraphQLString,
      args: {
        username: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      resolve (parents, args) {
        let foundUser;
        validateLoginUser(args.username, args.password);
        return User.findOne({username: args.username})
          .then(dbResult => {
            if (!dbResult) {
              return User.findOne({email: args.username});
            } else {
              return dbResult;
            }
          })
          .then(dbResult => {
            if (!dbResult) {
              return Promise.reject(new Error('That username or email does not exist.'));
            } else {
              foundUser = dbResult;
              return bcrypt.compare(args.password, dbResult.password);
            }
          })
          .then(validated => {
            if (!validated) {
              return Promise.reject(new Error('Invalid password. Try again.'));
            } else {
              return jwt.sign({
                subject: foundUser.username,
                username: foundUser.username, 
                id: foundUser.id
              }, JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: '7d'
              });
            }
          })
          .catch(err => {
            throw err;
          });
      }
    }
  })
});


module.exports = MutationType;