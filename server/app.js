const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const config = require('./config');

mongoose.connect(config.MONGO_URI);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

require('./routes')(app);

app.listen(config.PORT || 8082, function() {
  console.log("App Listening on port "+(config.PORT || 8082))
});
