/* eslint-disable strict */

module.exports = {
  //DB_URL: process.env.DB_URL || 'mongodb://localhost/equation-relay',
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET || 'PURPLE-FOO-BAR',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  WOLFRAM_URL: '',
  WOLFRAM_API_KEY: process.env.WOLFRAM_API_KEY || ''
};