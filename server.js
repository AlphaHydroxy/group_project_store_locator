// This kicks off an express server instance that responds to requests with responses. 

// Gives us an instance of express to work with
var express = require('express');
var app = express();

// Brings in body-parser to handle POST requests, which have their payload in the
// request body
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// All requests should go through controllers/index.js
app.use(require('./controllers/index'));

// Find express in the client/javascript/build.js file
app.use(express.static('client/build/javascript'));

// Server listens for requests on port 3000
app.listen(3000, function () {
  console.log('App running on port ' + this.address().port);
});