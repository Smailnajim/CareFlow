const mongoose = require('mongoose');

const Schem = new mongoose.Schema({
    roleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true},
    image: {type: String},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String},
    password: {type: String, required: true},
    status: {
        type: String,
        enum: ['active', 'suspended'],
        required: true
    },
    dateNasonse: {type: Date},
},{collation: 'users'});

module.exports = mongoose.model("User", Schem);