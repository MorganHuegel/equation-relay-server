/* eslint-disable strict */

module.exports = {
  //DB_URL: process.env.DB_URL || 'mongodb://localhost/equation-relay',
  DB_URL: process.env.DB_URL || 'mongodb://development:baseball1@ds159574.mlab.com:59574/equation-relay-development',
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET || 'PURPLE-FOO-BAR'
};