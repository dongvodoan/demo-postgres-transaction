'use strict';

var userController = require('../controllers/user');
var gameController = require('../controllers/game');
var txController = require('../controllers/transaction');
var config = require('../../config/configuration');


module.exports = function(app){
    app.post('/signup', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        var username = req.body.username;
        var password = req.body.password;

        if(username === undefined || username.trim() == ""){
            res.json({error: true, data: 'username is required'});
        } else if (password === undefined || password.trim() == ""){
            res.json({error: true, data: 'password is required'});
        } else {
            userController.insertUser(username, password, function(err, data){
                res.json({error:err, data: data});
            });
        }
    });


    app.post('/login', function(req,res){
        res.header('Access-Control-Allow-Origin', '*');
        var username = req.body.username;
        var password = req.body.password;

        if(username === undefined || username.trim() == ""){
            res.json({error: true, data: 'username is required'});
        } else if (password === undefined || password.trim() == ""){
            res.json({error: true, data: 'password is required'});
        } else {
            userController.login(username, password, function(err, data){
                res.json({error:err, data: data});
            });
        }
    });

    app.get('/users', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        userController.getAllUser(function(err, data){
            res.json({ error: err, data: data});
        });
    });

    app.post('/faucet', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        var user_id = req.body.user_id;

        if(user_id === undefined || user_id.trim() == ""){
            res.json({error: true, data: 'user_id is required'});
        } else {
            userController.faucet(user_id, function(err, data){
                res.json({error: err, data: data});
            });
        }
    });

    app.get('/get-balance/:user_id', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        var user_id = req.params.user_id;

        userController.getToken(user_id, function(err, data, id){
            res.json({error: err, data: {_id: id, balance: data}});
        });
    });

    app.get('/get-balance', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        res.json({error: true, data: 'user_id is required'});
    });

    app.get('/get-userinfo/:user_id', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        var user_id = req.params.user_id;

        userController.getUserInfo(user_id, function(err, data){
            res.json({ error: err, data: data});
        });
    });
}