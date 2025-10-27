const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    vitals: {
        temperature: { type: Number },
        bloodPressure: { type: String },
        heartRate: { type: Number },
        respiratoryRate: { type: Number },
        weight: { type: Number },
        height: { type: Number }
    },
    symptoms: { type: String },
    diagnosis: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { collection: 'consultations', timestamps: true });

module.exports = mongoose.model('Consultation', ConsultationSchema);