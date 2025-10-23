const TritmentsService = require('./../Services/TritmentsService');

exports.createATritmentForRendezvou = async (req, res) => {
    console.log('here in service tritment');
    const data = req.body; //don't use matchedData bucause we don't know what medecin want to add in tritmen toke it dynamique
    data.rendezvousId = req.params.rendezId;
    try {
        const tritment = await TritmentsService.createATritmentForRendezvou(data);
        return res.json({tritment});
    } catch (error) {
        return res.json({error: error.message});
    }
}