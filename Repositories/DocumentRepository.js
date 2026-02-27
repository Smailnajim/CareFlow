const Document = require('../Models/Document');

exports.createDocument = async (data) => {
    console.log('\n[DocumentRepository.createDocument]\n');
    return await Document.create(data);
}

exports.getPatientDocuments = async (patientId) => {
    console.log('\n[DocumentRepository.getPatientDocuments]\n');
    return await Document.find({ patientId }).populate('uploadedBy', 'firstName lastName').sort({ createdAt: -1 });
}

exports.deleteDocument = async (id) => {
    console.log('\n[DocumentRepository.deleteDocument]\n');
    return await Document.findByIdAndDelete(id);
}
