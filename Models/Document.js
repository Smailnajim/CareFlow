const {Schema, Types, model} = require('mongoose');

const documentSchema = new Schema({
    patientId: {type: Types.ObjectId, ref: 'User', required: true},
    uploadedBy: {type: Types.ObjectId, ref: 'User', required: true},
    tritmentId: {type: Types.ObjectId, ref: 'Tritment'},
    fileName: {type: String, required: true},
    fileUrl: {type: String, required: true},
    fileType: String,
    category: {type: String, enum: ['imagerie', 'rapport', 'lab', 'other'], default: 'other'}
}, {timestamps: true});

module.exports = model('Document', documentSchema);
