'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const app = express();

const { PORT, DB_URL } = require('./config');
const graphqlSchema = require('./graphql_schema/graphql');



app.use('/graphql', graphqlHTTP(req => ({
  schema: graphqlSchema,
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