const DocumentService = require('../Services/DocumentService');
const { matchedData } = require('express-validator');
const minioClient = require('../Config/minioClient');

exports.uploadDocument = async (req, res) => {
    console.log('\n[DocumentController.uploadDocument]\n');
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const bucketName = 'uploads';
        const fileName = `${Date.now()}-${req.file.originalname}`;
        
        await minioClient.putObject(bucketName, fileName, req.file.buffer);

        const documentData = {
            patientId: req.body.patientId,
            uploadedBy: req.user._id,
            tritmentId: req.body.tritmentId,
            fileName: req.file.originalname,
            fileUrl: fileName,
            fileType: req.file.mimetype,
            category: req.body.category || 'other'
        };

        const document = await DocumentService.createDocument(documentData);
        return res.json({ valid: 'Document uploaded successfully', document });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

exports.getPatientDocuments = async (req, res) => {
    console.log('\n[DocumentController.getPatientDocuments]\n');
    const { patientId } = matchedData(req, { locations: ['params'] });
    try {
        const documents = await DocumentService.getPatientDocuments(patientId);
        return res.json({ documents });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

exports.deleteDocument = async (req, res) => {
    console.log('\n[DocumentController.deleteDocument]\n');
    const { documentId } = matchedData(req, { locations: ['params'] });
    try {
        await DocumentService.deleteDocument(documentId);
        return res.json({ valid: 'Document deleted successfully' });
    } catch (error) {
        return res.json({ error: error.message });
    }
}
