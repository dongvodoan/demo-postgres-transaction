'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    accessToken: { type: String },
}, { timestamps: true });

const userMeta = mongoose.model('UserMeta', userSchema);

module.exports = userMeta;
