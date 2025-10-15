const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
    medecinId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    patientId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    status: {type: String, enum: ['created', 'enCoure', 'anneler', 'complex'], required: true},
    dateStar: Date,
    dateFine: Date,
    cause: String
},{collection: 'rendezvous', timeseries: true});

module.exports = mongoose.model('RendezVous', rendezVousSchema);