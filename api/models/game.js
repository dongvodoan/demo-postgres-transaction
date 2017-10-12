'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;
var gameSchema = new Schema({
    gameTypeId: String,
    amount: Number,
    player1: String,
    player2: String,
    winner: String,
    status: Number, //  0: playing, 1: over
    createdAt: Date,
    updatedAt: Date
});

var gameMeta = mongoose.model('GameMeta', gameSchema);

module.exports = gameMeta;