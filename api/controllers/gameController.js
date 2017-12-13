
'use strict';

var Game = require('../models/game');
var User = require('../models/user');
var GameType = require('../models/gametype');
var async = require('async');

module.exports = {

    postNewGameMatch: asyncWrap(async (req, res) => {
        const gameTypeId   = req.body.gameTypeId;
        const player1  = req.body.player1;
        const player2  = req.body.player2;
        const amount = req.body.amount;
        let gameType = await gametype.findOne({_id: gameTypeId});
        let newGameMatch = await gameRepository.createNewGameMatch(gameTypeId, player1, player2, amount);
        if (newGameMatch) {
            let promise = await Promise.all([
                transactionRepository.postSubtractAmount(player1, amount, gameType.app_id),
                transactionRepository.postSubtractAmount(player2, amount, gameType.app_id),
                historyRepository.createHistoryTransaction(player1, amount, 0),
                historyRepository.createHistoryTransaction(player2, amount, 0),
            ]);

            if (promise[0].status !== 200) {
                await historyTransaction.findByIdAndUpdate({ _id: promise[2]._id }, { $set: { status: 0 }});
            }
            if (promise[1].status !== 200) {
                await historyTransaction.findByIdAndUpdate({ _id: promise[3]._id }, { $set: { status: 0 }});
            }
        }
        res.json({error: false, data: newGameMatch});
    }),

    postEndGame: asyncWrap(async (req, res) => {
        const gameId = req.body.gameId;
        const winner = req.body.winner;
        let updateGameMatch = await game.findByIdAndUpdate({_id: gameId}, {
            $set: {
                status: 1,
                winner: winner
            }
        }, {new: true}).populate('gameTypeId', 'app_id');
        
        if (updateGameMatch) {
            let ratio = await gameRepository.getGameTypeRatio({_id: updateGameMatch.gameTypeId});
            let amountAdd = updateGameMatch.amount * 2 * (1 - ratio);
            let promise = await Promise.all([
                transactionRepository.postAddAmount(winner, amountAdd, updateGameMatch.gameTypeId.app_id),
                historyRepository.createHistoryTransaction(winner, amountAdd, 1),
            ]);

            if (promise[0].status !== 200) {
                await historyTransaction.findByIdAndUpdate({ _id: promise[1]._id }, { $set: { status: 0 }});
            }
        }

        res.json({error: false, data: updateGameMatch});
    }),

    getAllGame: asyncWrap(async (req, res) => {
        let gameMaths =  await game.find({});
        res.json({error: false, data: gameMaths});
    }),

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

    getHistoryByUserId: asyncWrap(async (req, res) => {
        let userId = req.params.id;
        let historyUser =  await game.find({$or: [{player1: userId}, {player2: userId}]});
        res.json({error: false, data: historyUser});
    }),

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
    },

    insertGameMultiPlayers: asyncWrap(async (req, res) => {
        const gameTypeId   = req.body.gameTypeId;
        let players  = req.body.players.split(",");
        const amount = req.body.amount;
        let gameType = await gametype.findOne({_id: gameTypeId});
        let newGameMatch = await gameRepository.insertNewGameMultiPlayers(gameTypeId, players, amount);    
        if (newGameMatch) {
            players = newGameMatch.players;
            for (let i = 0; i < players.length; i++) {
                let player = players[i];
                let promise = await Promise.all([
                    transactionRepository.postSubtractAmount(player, amount, gameType.app_id),
                    historyRepository.createHistoryTransaction(player, amount, 0),
                ]);
                if (promise[0] !== 200) {
                    await historyTransaction.findByIdAndUpdate({ _id: promise[1]._id }, { $set: { status: 0 }});                    
                }
            }
        }
        res.json({error: false, data: newGameMatch});
    }),

    postEndGameMultiPlayers: asyncWrap(async (req, res) => {
        const gameId = req.body.gameId;
        const winner = req.body.winner;
        
        let updateGameMatch = await game.findByIdAndUpdate({_id: gameId}, {
            $set: {
                status: 1,
                winner: winner
            }
        }, {new: true}).populate('gameTypeId', 'app_id');
        
        if (updateGameMatch) {
            let ratio = await gameRepository.getGameTypeRatio({_id: updateGameMatch.gameTypeId});
            let amountAdd = updateGameMatch.amount * updateGameMatch.players.length * (1 - ratio);
            let promise = await Promise.all([
                transactionRepository.postAddAmount(winner, amountAdd, updateGameMatch.gameTypeId.app_id),
                historyRepository.createHistoryTransaction(winner, amountAdd, 1),
            ]);

            if (promise[0].status !== 200) {
                await historyTransaction.findByIdAndUpdate({ _id: promise[1]._id }, { $set: { status: 0 }});
            }
        }

        res.json({error: false, data: updateGameMatch});
    }),
}
