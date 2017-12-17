'use strict'
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const LikeSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.ObjectId, ref: 'User' },
    post : { type: mongoose.Schema.ObjectId, ref: 'Post' },
    isLiked : { type : Boolean },
});

LikeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Like', LikeSchema);