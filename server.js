'use strict';
require('dotenv').config();

const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app); // socket.io requires an http instance, not express
const io = require('socket.io')(server);

const { PORT, DB_URL, CLIENT_ORIGIN } = require('./config');
const { socketConnect } = require('./sockets/socketMain');
const unprotectedGraphqlSchema = require('./unprotected_graphql_schema/graphql');
const protectedGraphqlSchema = require('./protected_graphql_schema/graphql');
const { validateJWTMiddleware } = require('./protected_graphql_schema/valdateJWT');
const { gameSessionRouter } = require('./routes/gameSessionRouter');
const { wolframRouter } = require('./routes/wolframRouter');

app.use(cors(CLIENT_ORIGIN));
app.use(express.json());

io.on('connection', socketConnect);

app.use('/checkGameSession', gameSessionRouter);
app.use('/checkAnswer', wolframRouter);

app.use('/graphql/protected', validateJWTMiddleware, graphqlHTTP(req => ({
  schema: protectedGraphqlSchema,
  graphiql: true,
  formatError(err) {
    console.error(err);
    return {
      message: err.message,
      locations: err.locations,
      path: err.path
    };
  }
})));

app.use('/graphql/unprotected', graphqlHTTP(req => ({
  schema: unprotectedGraphqlSchema,
  graphiql: true,
  formatError(err) {
    console.error(err);
    return {
      message: err.message,
      locations: err.locations,
      path: err.path
    };
  }
})));



mongoose.connect(DB_URL, {useNewUrlParser: true});


server.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});