const TritmentsService = require('./../Services/TritmentsService');
const { matchedData } = require('express-validator');

exports.createATritmentForRendezvou = async (req, res) => {
    console.log('here in service tritment');
    const data = req.body;
    data.rendezvousId = req.params.rendezId;
    try {
        const tritment = await TritmentsService.createATritmentForRendezvou(data);
        return res.json({tritment});
    } catch (error) {
        return res.json({error: error.message});
    }
}

exports.getTritment = async (req, res) => {
    const { tritmentId } = matchedData(req, { locations: ['params'] });
    try {
        const tritment = await TritmentsService.getTritmentById(tritmentId, req.user);
        return res.json({ tritment });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

exports.updateTritment = async (req, res) => {
    const { tritmentId } = matchedData(req, { locations: ['params'] });
    const data = req.body;
    try {
        const tritment = await TritmentsService.updateTritment(tritmentId, data);
        return res.json({ valid: 'treatment updated successfully', tritment });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

exports.deleteTritment = async (req, res) => {
    const { tritmentId } = matchedData(req, { locations: ['params'] });
    try {
        await TritmentsService.deleteTritment(tritmentId);
        return res.json({ valid: 'treatment deleted successfully' });
    } catch (error) {
        return res.json({ error: error.message });
    }
}