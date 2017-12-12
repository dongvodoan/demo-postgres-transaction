'use strict';

var userController = require('../controllers/userController');
var authController = require('../controllers/authController');
var gameController = require('../controllers/gameController');
var config = require('../../config/configuration');

module.exports = function(app){

    /**
     * Callback login BAP Platform
     * @body accessToken Token BAP Platform
     * @return
     */
    app.route('/login/bap-platform').post(authController.callbackPlatform);

    app.get('/users', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        userController.getAllUser(function(err, data){
            res.json({ error: err, data: data});
        });
    });

    app.get('/get-userinfo/:user_id', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        var user_id = req.params.user_id;

        userController.getUserInfo(user_id, function(err, data){
            res.json({ error: err, data: data});
        });
    });
}
