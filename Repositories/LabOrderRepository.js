const LabOrder = require('../Models/LabOrder');

exports.createLabOrder = async (data) => {
    console.log('\n[LabOrderRepository.createLabOrder]\n');
    return await LabOrder.create(data);
}

exports.getLabOrderById = async (id) => {
    console.log('\n[LabOrderRepository.getLabOrderById]\n');
    return await LabOrder.findById(id).populate('patientId medecinId');
}

exports.updateLabOrder = async (id, data) => {
    console.log('\n[LabOrderRepository.updateLabOrder]\n');
    return await LabOrder.findByIdAndUpdate(id, data, { new: true });
}

exports.getPatientLabOrders = async (patientId) => {
    console.log('\n[LabOrderRepository.getPatientLabOrders]\n');
    return await LabOrder.find({ patientId }).populate('medecinId');
}
