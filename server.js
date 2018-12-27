'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const app = express();

const { PORT, DB_URL } = require('./config');
const graphqlSchema = require('./graphql_schema/graphql');



app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true
}));



app.get('', (req, res) => {
  res.json('Hello World');
});


mongoose.connect(DB_URL);


app.listen(PORT, () => {
  console.info(`Example app listening on port ${PORT}!`);
});