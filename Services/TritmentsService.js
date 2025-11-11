const TritmentRepository = require('../Repositories/TritmentsRepository');
const RoleService = require('./RoleService');
const RendezvousRepository = require('../Repositories/RendezvousRepository');

exports.createATritmentForRendezvou = async (datTritment) => {
    console.log('data tritment', datTritment);
    const tritment = await TritmentRepository.createATritment(datTritment);
    if (!tritment) throw new Error('tritment not created!');
    return tritment;
}

exports.getTritmentById = async (id, authUser) => {

    const tritment = await TritmentRepository.getTritmentById(id);
    if (!tritment) throw new Error('treatment not found');
    const role = await RoleService.getRoleById(authUser.roleId);
    if (role.name === 'patient') {
        const rendezvous = await RendezvousRepository.getRendezvousById(tritment.rendezvousId);
        if (!rendezvous || rendezvous.patientId.toString() !== authUser._id.toString()) {
            throw new Error('You can only view your own treatments');
        }
    }
    
    return tritment;
}

exports.updateTritment = async (id, data) => {
    const tritment = await TritmentRepository.updateTritment(id, data);
    if (!tritment) throw new Error('treatment not found');
    return tritment;
}

exports.deleteTritment = async (id) => {
    const tritment = await TritmentRepository.deleteTritment(id);
    if (!tritment) throw new Error('treatment not found');
    return tritment;
}