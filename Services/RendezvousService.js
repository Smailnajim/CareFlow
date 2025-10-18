const User = require('./../Models/User');
const RoleRepository = require('./../Repositories/RoleRepository');
const RendezvousRepository = require('./../Repositories/RendezvousRepository');
const {Types} = require('mongoose');

exports.CreerUnRendezvousPourPatient = async (req, res) => {

    // const role = await RoleRepository.roleDeUser(req.user.roleId);
    // console.log(role);
    const data = {};
    data.medecinId = req.body.medecinId;
    data.patientId = req.body.patientId;
    data.dateStar = req.body.dateStar;
    data.dateFine = req.body.dateFine;
    data.cause = req.body.cause;
    
    if (RoleRepository.roleDeUser(req.body.pmedicalId) != 'medecin') return res.json({error: `this is ${req.body.pmedicalId} not medecin`});

    const role = await RoleRepository.roleDeUser('68f0e9fe5f90a12e56122a42');
    if (role == 'Patient') {
        // if  (req.user._id != data.patientId) return res.json({error: 'you cant create rendezvou for another Patient'});
        if  ("68f0e9fe5f90a12e56122a42" != req.body.patientId) return res.json({error: 'you cant create rendezvou for another Patient'});
        data.dateStar = null;
        data.dateFine = null;
    }

    await RendezvousRepository.createRendezvou(data);
}

exports.medecinsDisponibilites = async (req, res) => {
    const Disponibilites = await RendezvousRepository.medecinsDisponibilites(req, res);
    return Disponibilites;
}

exports.VoirTousLesRendezVousDeLaClinique = async (req, res) => {
    RendezvousRepository.VoirTousLesRendezVousDeLaClinique(req, res);
}

exports.changeStatusRendezvous = async (req, res) => {
    const rendezvousId = new Types.ObjectId(req.body.rendezvousId);
    const rendezvous = await RendezvousRepository.getRendezvousById(rendezvousId);
    if(!rendezvous) return res.json({error: 'rendezvous not found'});

    rendezvous.status = req.body.status;
    await rendezvous.save();
    return res.json({rendezvous});

}

exports.updateRendez = async (data) => {
    console.log('data', data);
    const rendez = await RendezvousRepository.getRendezvousById(new Types.ObjectId(data.rendezvousId));
    console.log('rendez',rendez);
    
    

}