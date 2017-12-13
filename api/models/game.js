'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;
var gameSchema = new Schema({
    gameTypeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'GameTypeMeta'
    },
    amount: { type: Number },
    player1: { type: String },
    player2: { type: String },
    players: [{ type: Schema.ObjectId, ref: 'UserMeta' }],
    winner: { type: String },
    status: { type: Number, enum: [0, 1] }, //  0: playing, 1: over
}, { timestamps: true });

var gameMeta = mongoose.model('GameMeta', gameSchema);

module.exports = gameMeta;