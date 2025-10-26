const mongoose = require('mongoose');
const status = require('./../Enum/PrescriptionsStatus');

const PrescriptionsSchema = new mongoose.Schema({
    tritmentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tritments', required: true},
    medicaments: [{
        name: {type: String, required: true},
        dosage: {type: String, required: true},
        voieAdministration: {type: String, required: true},
        frequence: {type: String, required: true},
        duree: {type: String, required: true},
        renouvellements: {type: Number, required: true}
    }],
    Statuts: {type: String, enum: status, default: 'draft'},
}, {collection: 'prescriptions', timestamps: true});

module.exports = mongoose.model('Prescriptions', PrescriptionsSchema);