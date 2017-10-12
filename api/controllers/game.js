
'use strict';

var Game = require('../models/game');
var User = require('../models/user');
var GameType = require('../models/gametype');
var async = require('async');

module.exports = {
    insertGame: function (_gameTypeId, _player1, _player2, _amount, cb){
        var $this = this;
        var game = null;
        async.waterfall([
            function(cb){
                $this.checkGameTypeExists(_gameTypeId, cb);
            },
            function(data, cb){
                $this.checkValidUser(_player1, _amount, cb);
            },
            function(data, cb){
                $this.checkValidUser(_player2, _amount, cb);
            },
            function(data, cb){
                if(_player1 == _player2) {
                    cb('Can not play with yourself');
                } else {
                    $this.insertNewGame(_gameTypeId, _player1, _player2, _amount, cb);
                }
            },
            function(data, cb){
                game = data;
                $this.updateBalance(_player1, -_amount, cb);
            },
            function(data, cb){
                $this.updateBalance(_player2, -_amount, cb);
            }
        ], function(err, data){
            if(err){
                cb(true, err);
            } else {
                cb(false, game);
            }
        });
    },
    endGame: function(_gameId, _winner, cb){
        var $this = this;

        async.waterfall([
            function(cb){
                $this.checkGameById(_gameId, cb);
            },
            function(game, cb){
                if(_winner == 'null' || _winner == game.player1 || _winner == game.player2){
                    game.status = 1;
                    game.updatedAt = new Date();
                    game.winner = _winner;
                    $this.updateGame(_gameId, game, cb);
                } else {
                    cb('Invalid winner');
                }
            },
            function(game, cb){
                $this.getGameTypeRatio(game, cb);
            },
            function(game, ratio, cb){
                if(_winner == 'null'){
                    $this.updateBalance(game.player1, game.amount, function(err, data){
                        if(err){
                            cb(err);
                        } else {
                            $this.updateBalance(game.player2, game.amount, cb);
                        }
                    });
                } else {
                    var amount = game.amount * 2 * (1 - ratio);
                    $this.updateBalance(_winner, amount, cb);
                }
            }
        ], function(err, data){
            if(err){
                cb(true, err);
            } else {
                cb(false, 'End game successfully', _gameId);
            }
        });
    },
    getAllGame: function(cb){
        Game.find({}, function(err, data){
            if(err){
                cb(true, err);
            } else {
                cb(false, data);
            }
        });
    },

    deleteGame: function(_id, cb){
        Game.findById(_id, function(err, data) {
            if(err != null){
                cb(err);
            }
            data.remove(function (err) {
                cb(err);
            });
        });
    },

    checkGameTypeExists: function(gameTypeId, cb){
        GameType.findById(gameTypeId, function(err,data){
            if(err){
                cb(err);
            } else if(data === null){
                cb('Gametype not found');
            } else {
                cb(null, data);
            }
        });
    },

    checkGameExists: function(gameTypeId, romId, cb){
        Game.findOne({'gameTypeId': gameTypeId, 'roomId': romId}, function(err, data){
            if(err){
                cb(err);
            } else if(data === null) {
                cb(null, 'Game not found');
            } else {
                cb('Game exists', data);
            }
        });
    },

    checkGameById: function(gameId, cb){
        Game.findById(gameId, function(err, data){
            if(err){
                cb(err);
            } else if(data === null){
                cb('Game not found');
            } else if(data.status ==1){
                cb('Game is over');
            } else {
                cb(null, data);
            }
        });
    },

    checkValidUser: function(userId, amount, cb){
        User.findById(userId, function(err, data){
            if(err){
                cb(err);
            } else if(data === null) {
                cb(userId + ' not found');
            } else if(data.balance < amount){
                cb(userId + ' not enought token');
            }else {
                cb(null, data);
            }
        });
    },

    insertNewGame: function(_gameTypeId, _player1, _player2, _amount, cb){
        var game = new Game();
        game.gameTypeId = _gameTypeId;
        game.amount = _amount;
        game.player1 = _player1;
        game.player2 = _player2;
        game.winner = null;
        game.status = 0;
        game.createdAt = new Date();
        game.updatedAt = new Date();

        game.save(function(err, _game) {
            if(err != null){
                cb(err);
            } else{
                cb(null, _game);
            }
        });
    },

    updateBalance: function(userId, amount, cb){
        User.findByIdAndUpdate(userId,{
            $inc: { balance: amount},
            updatedAt: new Date()
        }, function(err, data){
            if(err){
                cb(err);
            } else {
                cb(null, data);             
            }
        });
    },

    updateGame: function(gameId, data, cb){
        Game.findByIdAndUpdate(gameId, data, {new: true} ,function(err, data){
            if(err){
                cb(err);
            } else {
                cb(null, data);
            }
        });
    },

    getGameTypeRatio: function(game,cb){
        GameType.findById(game.gameTypeId, function(err, data){
            if(err || data === null){
                cb(true);
            } else {
                cb(false, game, data.ratio);
            }
        });
    },

    getHistoryByUserId: function(userId, cb){
        Game.find({$or: [{player1: userId}, {player2: userId}]}, function(err, data){
            if(err){
                cb(true, err);
            } else {
                cb(false, data);
            }
        });
    },

    getGameById: function(gameId, cb){
        Game.findById(gameId, function(err, data){
            if(err){
                cb(true, err);
            } else if(data === null){
                cb(true, 'Game not found');
            } else {
                cb(false, data);
            }
        });
    }
}