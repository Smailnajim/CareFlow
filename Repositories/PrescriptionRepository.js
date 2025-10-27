const Prescription = require('../Models/Prescriptions');

exports.create = async(data) => {
    return await Prescription.create(data);
}

exports.getById = async(id) => {
    return await Prescription.findById(id)
        .populate('patientId', 'name email')
        .populate('doctorId', 'name email')
        .populate('tritmentId');
}

exports.getByPatient = async(patientId) => {
    return await Prescription.find({ patientId })
        .populate('doctorId', 'name email')
        .populate('tritmentId');
}

exports.getByDoctor = async(doctorId) => {
    return await Prescription.find({ doctorId })
        .populate('patientId', 'name email')
        .populate('tritmentId');
}

exports.updateStatus = async(id, status) => {
    return await Prescription.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
}

