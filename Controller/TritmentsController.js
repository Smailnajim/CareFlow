const TritmentsService = require('./../Services/TritmentsService');

exports.createATritmentForRendezvou = async (req, res) => {
    console.log('here in service tritment');
    const data = req.body;
    try {
        const tritment = await TritmentsService.createATritmentForRendezvou();
        return res.json({tritment});
    } catch (error) {
        return res.json({error: error.message});
    }
}