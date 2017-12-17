'use strict'
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CommentSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.ObjectId, ref: 'User' },
    post : { type: mongoose.Schema.ObjectId, ref: 'Post' },
    content : { type : Boolean },
    deletedAt : { type : Date},
}, { timestamps: true });

CommentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Comment', CommentSchema);