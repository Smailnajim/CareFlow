const TritmentRepository = require('../Repositories/TritmentsRepository');

exports.createATritmentForRendezvou = async (datTritment) => {


    console.log('data tritment', datTritment);
    const tritment = await TritmentRepository.createATritment(datTritment);
    if (!tritment) throw new Error('tritment not created!');
    return tritment;

    // const tritment = await TritmentRepository.createATritment(req, res);
    // return res.json({tritment});
}