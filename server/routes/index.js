const express = require('express');
const router  = express.Router();
const bodyParser  = require('body-parser');
const Promise = require('promise');

router.use(bodyParser.json());

module.exports = function(app) {
  app.use(router)
}
