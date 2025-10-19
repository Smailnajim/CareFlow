const TritmentsService = require('./../Services/TritmentsService');

exports.createATritmentForRendezvou = async (req, res) => {
    console.log('here in service tritment');
    await TritmentsService.createATritmentForRendezvou(req, res);
}