const DocumentRepository = require('../Repositories/DocumentRepository');

exports.createDocument = async (data) => {
    console.log('\n[DocumentService.createDocument]\n');
    const document = await DocumentRepository.createDocument(data);
    if (!document) throw new Error('Document not created');
    return document;
}

exports.getPatientDocuments = async (patientId) => {
    console.log('\n[DocumentService.getPatientDocuments]\n');
    return await DocumentRepository.getPatientDocuments(patientId);
}

exports.deleteDocument = async (id) => {
    console.log('\n[DocumentService.deleteDocument]\n');
    const document = await DocumentRepository.deleteDocument(id);
    if (!document) throw new Error('Document not found');
    return document;
}
