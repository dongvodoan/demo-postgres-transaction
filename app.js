'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var config = require('./config/configuration');
var event = require('./utils/listenEvent');
var app = new express();

const path = require("path");
const fse = require("fs-extra");


//  mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.db_url);

//  middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

global.asyncWrap = (fn, errorCallback) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            if (errorCallback){
                errorCallback(req, res, error);
            }
            else{
                res.json({error});
            }
        })
    }
};

/**
 * Global all Repositories in api/services
 */
let services = async () => {
    let servicesDir = path.join(__dirname, 'api/services');
    let allServiceFiles = await fse.readdir(servicesDir);
    for (let serviceFile of allServiceFiles) {
        let nameOfService = serviceFile.replace('.js', '');
        global[nameOfService] = require(path.join(servicesDir, nameOfService));
    }
}
services();

//  api
require('./api/routes/index')(app);
require('./api/routes/game')(app);
require('./api/routes/gametype')(app);

/*
var GameType = require('./api/controllers/gametype');
GameType.insertGameType('headshot', 'bap headshot', 0.1);
GameType.insertGameType('sumo', 'bap sumo', 0.2);
GameType.insertGameType('football', 'bap football', 0.25);
*/

app.listen(config.port, function(err) {
    if (err) {
        console.log('Start server error');
    } else {
        console.log(
            `
              =====================================================
              -> Server Game 🏃 (running) on Port:${config.port}
              =====================================================
            `
        );
    }
});
