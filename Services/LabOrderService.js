const LabOrderRepository = require('../Repositories/LabOrderRepository');

exports.createLabOrder = async (data) => {
    console.log('\n[LabOrderService.createLabOrder]\n');
    const labOrder = await LabOrderRepository.createLabOrder(data);
    if (!labOrder) throw new Error('Lab order not created');
    return labOrder;
}

exports.getLabOrderById = async (id) => {
    console.log('\n[LabOrderService.getLabOrderById]\n');
    const labOrder = await LabOrderRepository.getLabOrderById(id);
    if (!labOrder) throw new Error('Lab order not found');
    return labOrder;
}

exports.updateLabOrder = async (id, data) => {
    console.log('\n[LabOrderService.updateLabOrder]\n');
    const labOrder = await LabOrderRepository.updateLabOrder(id, data);
    if (!labOrder) throw new Error('Lab order not found');
    return labOrder;
}

exports.getPatientLabOrders = async (patientId) => {
    console.log('\n[LabOrderService.getPatientLabOrders]\n');
    return await LabOrderRepository.getPatientLabOrders(patientId);
}
