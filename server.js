'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');

const app = express();

const { PORT } = require('./config');
const { graphqlSchema } = require('./graphql_schema/game');



app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true
}));



app.get('', (req, res) => {
  res.json('Hello World');
});



app.listen(PORT, () => {
  console.info(`Example app listening on port ${PORT}!`);
});