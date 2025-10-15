const mongoose = require('mongoose');
const roles = require('./../Enum/Roles');

const schem = new mongoose.Schema({
    name: {
        type: String,
        enum: roles,
        required: true
    }
},{collection: 'roles', timestamps: true });

module.exports = mongoose.model('Role', schem);