'use strict';

const userController = require('../controllers/userController');

module.exports = function(app){
    app.route('/admin/users').get(userController.getUsersForAdmin);

    app.route('/user/me').get(userController.getProfileMe);
};
