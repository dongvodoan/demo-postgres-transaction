'use strict';

var userController = require('../controllers/userController');
var authController = require('../controllers/authController');
var config = require('../../config/configuration');

module.exports = function(app){

    /**
     * Callback login BAP Platform Route
     * @body accessToken Token BAP Platform
     */
    app.route('/login/bap-platform').post(authController.callbackPlatform);

    /**
     * Get all user Route
     * @headers x-access-token
     */
    app.route('/users').get(userController.getUsers);

    /**
     * Get detail user Route
     * @headers x-access-token
     */
    app.route('/get-userinfo/:id').get(userController.getUser);

    /**
     * Get user current login
     * @headers x-access-token
     */
    app.route('/user/me').get(userController.getProfile);

    app.route('/history-transaction').get(userController.getHistoryTransactions);
}