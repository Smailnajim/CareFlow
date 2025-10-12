const mongoose = require('mongoose');

const schem = mongoose.Schema({
    name: {
        type: String,
        enum:['Patient', 'Admin', 'Infirmiers', 'medecin', 'secritaire'],
        required: true
    }
},{collation: 'roles'});

module.exports = mongoose.model('Role', schem);