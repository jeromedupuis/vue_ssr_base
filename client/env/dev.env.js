'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"localhost:8082"',
  CLIENT_URL: '"localhost:8081"',
  HOST: '"localhost"',
  PORT: 8081
});
