'use strict'
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ReportSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.ObjectId, ref: 'User' },
    post : { type: mongoose.Schema.ObjectId, ref: 'Post' },
    isHandled : { type : Boolean },
    deletedAt : { type : Date},
}, { timestamps: true });

ReportSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Report', ReportSchema);