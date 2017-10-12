'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;
var gameTypeSchema = new Schema({
    name: String,
    description: String,
    ratio: Number   //  0 < ratio < 1
});

var gameTypeMeta = mongoose.model('GameTypeMeta', gameTypeSchema);

module.exports = gameTypeMeta;