const mongoose = require('mongoose');

const schem = mongoose.Schema({
    name: {
        type: String,
        enum:['Patient', 'Admin', 'Infirmiers', 'medecin', 'secritaire'],
        required: true
    }
},{collection: 'roles', timestamps: true });

module.exports = mongoose.model('Role', schem);