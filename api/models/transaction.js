'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;
var transactionSchema = new Schema({
    transactionHash: String,
    from: String,
    to: String,
    amount: Number,
    status: Number,
    createdAt: Date,
    updatedAt: Date
});

var transactionMeta = mongoose.model('TransactionMeta', transactionSchema);

module.exports = transactionMeta;