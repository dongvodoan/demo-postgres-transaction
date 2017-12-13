'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const gameTypeSchema = new Schema({
    app_id: { type: String },
    name: { type: String },
    description: { type: String },
    ratio: { type: Number }   //  0 < ratio < 1
}, { timestamps: true });

const gameTypeMeta = mongoose.model('GameTypeMeta', gameTypeSchema);

module.exports = gameTypeMeta;
