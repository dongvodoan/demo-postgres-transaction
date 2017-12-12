'use strict';

var gameController = require('../controllers/gameController');

module.exports = function(app){

    app.get('/games', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        gameController.getAllGame(function(err, data){
            res.json({error: err, data: data});
        });
    });

    app.post('/playgame', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        var gameTypeId   = req.body.gameTypeId;
        var player1  = req.body.player1;
        var player2  = req.body.player2;
        var amount = req.body.amount;

        if( gameTypeId === undefined || gameTypeId.trim() == ""){
            res.json({error: true,data: 'gameTypeId not found'});
        } else if( player1 === undefined  || player1.trim() == ""){
            res.json({error: true, data: 'player 1 not found'});
        } else if( player2 === undefined  || player2.trim() == ""){
            res.json({error: true, data: 'player 2 not found'});
        } else if(amount === undefined || amount.trim() == ""){
            res.json({error: true, data: 'amount not found'});
        } else if(isNaN(parseFloat(amount))){
            res.json({error: true, data: 'amount is not number'});
        } else{
            gameController.insertGame(gameTypeId, player1,player2, amount, function (err, data) {
                res.json({error: err, data: data});
            });
        }
    });

    app.post('/endgame', function(req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        var gameId = req.body.gameId;
        var winner = req.body.winner;

        if(winner === undefined || winner.trim() == ""){
            res.json({error: true, data: 'can not find winner'});
        } else if(gameId === undefined || gameId.trim() == ""){
            res.json({error: true, data: 'gameId not found'});
        } else{
            gameController.endGame(gameId, winner, function(err, data, game_id) {
                res.json({error: err, data: {_id: game_id, data: data}});
            });
        }
    });

    app.get('/get-history/:user_id', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        var user_id = req.params.user_id;

        gameController.getHistoryByUserId(user_id, function(err, data){
            res.json({error: err, data: data});
        });
    });

    app.get('/get-history', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        res.json({error: true, data: 'user_id is required'});
    });

    app.get('/get-gameinfo/:game_id', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        var game_id = req.params.game_id;

        gameController.getGameById(game_id, function(err, data){
            res.json({error: err, data: data});
        });
    });

    app.get('/get-gameinfo', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        res.json({error: true, data: 'game_id is required'});
    });
}
