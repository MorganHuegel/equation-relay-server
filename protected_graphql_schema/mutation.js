'use strict';

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} = require('graphql');

const GameType = require('./game');
const { UserType, validateCreateUser } = require('./user');
const { QuestionType, QuestionInput } = require('./question');

const Game = require('../models/game');
const User = require('../models/user');
const Question = require('../models/question');
const GameSession = require('../models/gameSession');

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createGame: {
      type: GameType,
      args: {
        title: {type: GraphQLString},
        description: {type: GraphQLString}
      },
      resolve(parent, args, context) {
        let newGameInfo;
        //context is the request object
        const { userId } = context;
        let { title, description } = args;
        if (!description) {
          description = 'No description';
        }

        return Game.create({ userId, title, description })
          .then(gameInfo => {
            newGameInfo = gameInfo;
            return User.update( {_id: userId}, {$push: {games: gameInfo.id}});
          })
          .then(updateInfo => {
            if (updateInfo.nModified < 1) {
              return Game.findByIdAndDelete(newGameInfo.id)
                .then(() => {
                  throw new Error('Could not insert gameID into user collection.');
                });
            } else {
              return newGameInfo;
            }
          })
          .catch(err => {
            throw err;
          });
      }
    },

    updateQuestion: {
      type: QuestionType,
      args: {
        questionId: {type: GraphQLString},
        questionObject: {type: QuestionInput}
      },
      resolve(parents, args, context) {
        const userIdFromToken = context.userId;
        return User.findById(userIdFromToken).populate('games')
          .then(userData => {
            const correctUser = userData.games.find(game => {
              const questions = game.questions.map((questionId, index) => questionId.toString());
              return questions.includes(args.questionId);
            });

            if (correctUser) {
              return Question.findByIdAndUpdate(args.questionId, args.questionObject, {new: true});
            } else {
              return Promise.reject(new Error(`Question with id ${args.questionId} for user ${userIdFromToken} does not exist.`));
            }
          })
          .then(updatedQuestion => {
            return updatedQuestion;
          })
          .catch(err => {
            throw err;
          });
      }
    },

    createQuestion: {
      type: QuestionType,
      args: {
        questionObject: {type: QuestionInput}
      },
      resolve(parents, args, context) {
        let newQuestion;
        return Question.create(args.questionObject)
          .then(createdQuestion => {
            newQuestion = createdQuestion;
            return Game.update( {_id: createdQuestion.gameId}, {$push: {questions: createdQuestion.id}} );
          })
          .then(updateInfo => {
            if(updateInfo.nModified < 1) {
              return Question.findByIdAndDelete(newQuestion.id)
                .then(() => {
                  throw new Error('Could not insert question into game collection.');
                });
            } else {
              return newQuestion;
            }
          })
          .catch(err => {
            throw err;
          });
      }
    },

    deleteGame: {
      type: GraphQLString,
      args: {
        gameId: {type: GraphQLID}
      },
      resolve(parents, args, context){
        const userIdFromToken = context.userId;
        return Game.findOne({userId: userIdFromToken, _id: args.gameId})
          .then(validGame => {
            if (validGame) {
              return Game.findByIdAndDelete(args.gameId);
            } else {
              return Promise.reject(new Error(`Game with id ${args.gameId} for user ${userIdFromToken} does not exist.`));
            }
          })
          .then(deletedQuestion => {
            if (!deletedQuestion) {
              return Promise.reject(new Error(`Game with ID ${args.gameId} was not deleted.`));
            }
            return User.update( {_id: userIdFromToken}, {$pull: {games: args.gameId}});
          })
          .then(() => {
            return 'Successfully deleted Game ' + args.gameId;
          })
          .catch(err => {
            throw err;
          });
      }
    },

    startGameSession: {
      type: GraphQLString,
      args: {
        gameId: {type: GraphQLID}
      },
      resolve(parents, args, context) {
        const userIdFromToken = context.userId;
        //const sessionCode = Number.toString(Math.random())//48-57 && 65-90
        const sessionCode = 'AAAAAA'; // TO_DO: GENERATE RANDOME SESSION CODE HERE

        return GameSession.create({
          leader: userIdFromToken,
          sessionCode: sessionCode,
          gameId: args.gameId
        })
          .then(newGameSession => {
            return newGameSession.sessionCode;
          })
          .catch(err => {
            throw err;
          });
      }
    }
  })
});


module.exports = MutationType;