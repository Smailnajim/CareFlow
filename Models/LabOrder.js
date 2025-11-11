const {Schema, Types, model} = require('mongoose');

const testSchema = new Schema({
    name: String,
    type: String
}, {_id: false});

const resultSchema = new Schema({
    testName: String,
    value: String,
    unit: String,
    normalRange: String,
    isAbnormal: {type: Boolean, default: false}
}, {_id: false});

const labOrderSchema = new Schema({
    patientId: {type: Types.ObjectId, ref: 'User', required: true},
    medecinId: {type: Types.ObjectId, ref: 'User', required: true},
    tritmentId: {type: Types.ObjectId, ref: 'Tritment'},
    tests: [testSchema],
    status: {type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending'},
    results: [resultSchema],
    pdfReport: String
}, {timestamps: true});

module.exports = model('LabOrder', labOrderSchema);
