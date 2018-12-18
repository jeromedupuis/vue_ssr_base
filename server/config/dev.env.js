'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  PORT: 8082,
  NODE_ENV: "development",
  MONGO_URI: "mongodb://localhost:27017/vue_ssr_sample",
  FORCE_AUTH: false
});
