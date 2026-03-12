let mongoose = require('mongoose');

let userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: [true, 'username khong duoc trong'],
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: [true, 'email khong duoc trong'],
            required: true,
            trim: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            default: '',
            trim: true,
        },
        avatarUrl: {
            type: String,
            default: 'https://i.sstatic.net/l60Hf.png',
            trim: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
        },
        loginCount: {
            type: Number,
            default: 0,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
