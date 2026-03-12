let mongoose = require('mongoose');

let roleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: [true, 'name khong duoc trong'],
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
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

module.exports = mongoose.model('Role', roleSchema);
