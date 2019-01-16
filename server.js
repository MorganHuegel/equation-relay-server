'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const { PORT, DB_URL } = require('./config');
const unprotectedGraphqlSchema = require('./unprotected_graphql_schema/graphql');

app.use(cors());
app.use(express.json());

app.use('/graphql/protected', /* AUTHENTACTION HERE */(req, res, next) => next());

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


app.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});