const Consultation = require('../Models/Consultation');

const createConsultation = async (data) => {
    return await Consultation.create(data);
};

const getConsultationById = async (id) => {
    return await Consultation.findById(id)
        .populate('patientId', 'firstName lastName email')
        .populate('doctorId', 'firstName lastName email');
};

const getPatientConsultations = async (patientId) => {
    return await Consultation.find({ patientId })
        .populate('doctorId', 'firstName lastName email')
        .sort({ createdAt: -1 });
};

const getDoctorConsultations = async (doctorId) => {
    return await Consultation.find({ doctorId })
        .populate('patientId', 'firstName lastName email')
        .sort({ createdAt: -1 });
};

const updateConsultation = async (id, data) => {
    return await Consultation.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );
};

module.exports = {
    createConsultation,
    getConsultationById,
    getPatientConsultations,
    getDoctorConsultations,
    updateConsultation
};