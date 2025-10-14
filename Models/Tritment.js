const {Schema, Types, model} = require('mongoose');

const tritmentSchema = new Schema({
    rendezVousId: {type: Types.ObjectId, required: true},
    description: String
});

module.exports = model('Tritment', tritmentSchema);