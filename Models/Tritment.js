const {Schema, Types, model} = require('mongoose');

const tritmentSchema = new Schema({
    rendezVousId: {type: Types.ObjectId, required: true},
    description: String
}, {collection: 'tritments', timestamps: true});

module.exports = model('Tritment', tritmentSchema);