'use strict';

var gameTypeController = require('../controllers/gametypeController');

module.exports = function(app){
    app.get('/gametypes', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        gameTypeController.getAllGameType(function(err, data){
            res.json({error: err, data: data});
        });
    });
}
