const mongoose = require('mongoose');

const schem = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true}
}, {collection: 'tokens'});

module.exports = mongoose.model('Token', schem);