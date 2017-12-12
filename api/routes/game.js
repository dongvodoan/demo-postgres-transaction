'use strict';

var gameController = require('../controllers/gameController');

module.exports = function(app){

    app.route('/games').get(gameController.getAllGame);

    app.route('/playgame').post(gameController.postNewGameMatch);

    app.route('/endgame').post(gameController.postEndGame);

    app.route('/get-history/:id').get(gameController.getHistoryByUserId);

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

    app.route('/playgame2').post(gameController.insertGameMultiPlayers);

    app.route('/endgame2').post(gameController.postEndGameMultiPlayers);
};
