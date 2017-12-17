'use strict'
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.ObjectId, ref: 'User' },
    categories : [{ type: mongoose.Schema.ObjectId, ref: 'Category' }],
    title : { type: String },
    content : { type : String },
    isBlocked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    deletedAt : { type : Date },
}, { timestamps: true });

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);