"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const UserSchema = new mongoose.Schema({
    email               : { type: String, min: 5, max: 255, unique: true, require: true },
    password            : { type: String, max: 255, require: true },
    nickname            : { type: String, max: 255 },
    avatar              : { type: Object },
    gender              : { type: Number, enum: [0, 1] },
    phone               : { type: String },
    birthday            : { type: Date },
    role                : { type: Number, enum: [0, 1], default: 0 },
    verifyCode          : { type: String, max: 32 },
    isVerified          : { type: Boolean, default: false },
    isBlocked           : { type: Boolean, default: false },
    deletedAt           : { type: Date },
}, { timestamps: true });

UserSchema.plugin(mongoosePaginate);

// Before create new User, let hash user password
UserSchema.pre('save', async function save (next) {
    try {
        const user = this;
        // hash password
        if (user.password)
            user.password = await bcryptService.hash(user.password);

        next();
    } catch (error) {
        next(error)
    }
});

module.exports = mongoose.model('User', UserSchema);
