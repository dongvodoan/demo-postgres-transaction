'use strict';

const fakerController = require('../controllers/fakerController');
const config = require('../../config/configuration');

module.exports = function(app){
    app.route('/faker/clean-all-dbs').get(fakerController.cleanAll);

    app.route('/faker/game-types').get(fakerController.fakeGameType);
}
