const ConsultationRepository = require('../Repositories/ConsultationRepository');
const Logger = require('../Utils/Logger');

const createConsultation = async (req, res) => {
    try {
        const consultationData = req.body;
        consultationData.doctorId = req.user._id;
        
        const consultation = await ConsultationRepository.createConsultation(consultationData);
        
        res.status(201).json({
            success: true,
            data: consultation
        });
    } catch (error) {
        Logger.error(`Error creating consultation: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const consultation = await ConsultationRepository.getConsultationById(id);

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: 'Consultation not found'
            });
        }

        res.json({
            success: true,
            data: consultation
        });
    } catch (error) {
        Logger.error(`Error getting consultation: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getPatientConsultations = async (req, res) => {
    try {
        const { patientId } = req.params;
        const consultations = await ConsultationRepository.getPatientConsultations(patientId);

        res.json({
            success: true,
            data: consultations
        });
    } catch (error) {
        Logger.error(`Error getting patient consultations: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getDoctorConsultations = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const consultations = await ConsultationRepository.getDoctorConsultations(doctorId);

        res.json({
            success: true,
            data: consultations
        });
    } catch (error) {
        Logger.error(`Error getting doctor consultations: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const consultation = await ConsultationRepository.updateConsultation(id, updateData);

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: 'Consultation not found'
            });
        }

        res.json({
            success: true,
            data: consultation
        });
    } catch (error) {
        Logger.error(`Error updating consultation: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createConsultation,
    getConsultation,
    getPatientConsultations,
    getDoctorConsultations,
    updateConsultation
};