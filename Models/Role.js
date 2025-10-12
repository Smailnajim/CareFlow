const mongoose = require('mongoose');

const schem = mongoose.Schema({
    name: {type: String, required: true}
},{collation: 'roles'});

module.exports = mongoose.model('Role', schem);