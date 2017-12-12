'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    accessToken: String,
    keystore: String,
    address: String,
    balance: Number,
    faucetedAt: Date
}, { timestamps: true });

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var userMeta = mongoose.model('UserMeta', userSchema);

module.exports = userMeta;
