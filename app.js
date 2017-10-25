'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/configuration');
var app = new express();

//  mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.db_url, {
    useMongoClient: true
});

//  middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  api
require('./api/routes/index')(app);
require('./api/routes/game')(app);
require('./api/routes/gametype')(app);

app.listen(config.port, function(err) {
    if (err) {
        console.log('Start server error');
    } else {
        console.log('App listening on port: ' + config.port);
    }
});