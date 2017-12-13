'use strict';

var gameTypeController = require('../controllers/gametypeController');

module.exports = function(app){
    app.route('/gametypes').get(gameTypeController.getAllGameType);

    app.route('/admin/game-type').post(gameTypeController.postGameType);
};
