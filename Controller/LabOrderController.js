const LabOrderService = require('../Services/LabOrderService');
const { matchedData } = require('express-validator');

exports.createLabOrder = async (req, res) => {
    console.log('\n[LabOrderController.createLabOrder]\n');
    
    if (!req.user) {
        return res.json({ error: 'User not authenticated' });
    }
    
    const data = {
        patientId: req.body.patientId,
        tritmentId: req.body.tritmentId,
        tests: req.body.tests,
        medecinId: req.user._id || req.user.id
    };
    
    console.log('data to create:', JSON.stringify(data, null, 2));
    
    try {
        const labOrder = await LabOrderService.createLabOrder(data);
        return res.json({ valid: 'Lab order created successfully', labOrder });
    } catch (error) {
        console.error('Error creating lab order:', error);
        return res.json({ error: error.message });
    }
}

exports.getLabOrder = async (req, res) => {
    console.log('\n[LabOrderController.getLabOrder]\n');
    const { labOrderId } = matchedData(req, { locations: ['params'] });
    try {
        const labOrder = await LabOrderService.getLabOrderById(labOrderId);
        return res.json({ labOrder });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

exports.updateLabOrder = async (req, res) => {
    console.log('\n[LabOrderController.updateLabOrder]\n');
    const { labOrderId } = req.params;
    const data = req.body;
    console.log('Update data:', JSON.stringify(data, null, 2));
    try {
        const labOrder = await LabOrderService.updateLabOrder(labOrderId, data);
        return res.json({ valid: 'Lab order updated successfully', labOrder });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

exports.getPatientLabOrders = async (req, res) => {
    console.log('\n[LabOrderController.getPatientLabOrders]\n');
    const { patientId } = matchedData(req, { locations: ['params'] });
    try {
        const labOrders = await LabOrderService.getPatientLabOrders(patientId);
        return res.json({ labOrders });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

exports.downloadLabReport = async (req, res) => {
    console.log('\n[LabOrderController.downloadLabReport]\n');
    const { labOrderId } = matchedData(req, { locations: ['params'] });
    try {
        const labOrder = await LabOrderService.getLabOrderById(labOrderId);
        if (!labOrder.pdfReport) {
            return res.json({ error: 'No PDF report available' });
        }
        return res.json({ pdfUrl: labOrder.pdfReport });
    } catch (error) {
        return res.json({ error: error.message });
    }
}
