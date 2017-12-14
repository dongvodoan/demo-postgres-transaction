"use strict";

const mongoose = require('mongoose');
const status = {
    fail: 0,
    success: 1
};
const methods = {
    subtractCoin: 0,
    addCoin: 1
};

const HistoryTransactionSchema = new mongoose.Schema(
    {
        user : {
            type: mongoose.Schema.ObjectId,
            ref: 'UserMeta'
        },
        amount : {
            type: Number,
        },
        status : {
            type: Number,
            enum: [0, 1] // 0: fail ; 1: success
        },
        method : {
            type: Number,
            enum: [0, 1] // 0: subtract coin ; 1: add coin
        },
        gameType: {
            type: mongoose.Schema.ObjectId,
            ref: 'GameTypeMeta'
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('HistoryTransaction', HistoryTransactionSchema);
module.exports.status = status;
module.exports.methods = methods;

