/* eslint-disable strict */

module.exports = {
  DB_URL: process.env.DB_URL || 'mongodb://localhost/equation-relay',
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET || 'PURPLE-FOO-BAR'
};