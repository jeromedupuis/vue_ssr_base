const env = require('./'+process.env.NODE_ENV.toLowerCase()+'.env');

module.exports = env;
