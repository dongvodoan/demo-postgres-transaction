'use strict';

const fakerController = require('../controllers/fakerController');

module.exports = function(app){
    app.route('/faker/clean-all-dbs').get(fakerController.cleanAll);

    app.route('/faker/data').get(fakerController.fakeData);
}
