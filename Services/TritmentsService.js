const { matchedData } = require('express-validator');
const TritmentRepository = require('../Repositories/TritmentsRepository');

exports.createATritmentForRendezvou = async (req, res) => {
    
    try {
        const data = req.body;
        
        console.log('data tritment', data);
        const tritment = await TritmentRepository.createATritment(data);
        return res.json({tritment});
    } catch (error) {
        console.log('error in service tritment');
        return res.json({error: error.message});
    }

    // const tritment = await TritmentRepository.createATritment(req, res);
    // return res.json({tritment});
}