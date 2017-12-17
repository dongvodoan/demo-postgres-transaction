'use strict'
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CategorySchema = new mongoose.Schema({
    name : { type: String, require: true, unique: true },
    description : { type : String },
    deletedAt : { type : Date },
}, { timestamps: true });

CategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Category', CategorySchema);