'use strict';

const mongoose = require('mongoose');

const gameTypeSchema = new mongoose.Schema({
    appId: { type: String },
    name: { type: String },
    description: { type: String },
    ratio: { type: Number }   //  0 < ratio < 1
}, { timestamps: true });

module.exports  = mongoose.model('GameTypeMeta', gameTypeSchema);
