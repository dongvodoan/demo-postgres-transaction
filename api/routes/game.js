'use strict';

var gameController = require('../controllers/gameController');

module.exports = function(app){

    app.route('/admin/games').get(gameController.getAllGame);

    app.route('/playgame').post(gameController.postNewGameMatch);

    app.route('/endgame').post(gameController.postEndGame);

    app.route('/admin/get-history/:id').get(gameController.getHistoryByUserId);

    app.route('/get-gameinfo/:id').get(gameController.getGameById);

    app.route('/playgame2').post(gameController.insertGameMultiPlayers);

    app.route('/endgame2').post(gameController.postEndGameMultiPlayers);
};
