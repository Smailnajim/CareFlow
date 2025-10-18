const User = require('./../Models/User');
const RoleRepository = require('./../Repositories/RoleRepository');
const RendezvousRepository = require('./../Repositories/RendezvousRepository');
const {Types} = require('mongoose');
const {matchedData} = require('express-validator');
const UserRepository = require('./../Repositories/UserRepository');
const statusEnum = require('./../Enum/RendezvouStatus');


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

exports.updateRendez = async (req, res) => {
    const data = matchedData(req, {locations: ['body']});

    const Keys = Object.keys(data);
    console.log('data--------\n', data);
    try {
        const rendez = await RendezvousRepository.getRendezvousById(new Types.ObjectId(data.rendezvousId));
        // console.log('jjj--------\n',rendez);
        console.log('medecin--------\n', Keys);
        console.log('medecin--------\n', Keys.includes('medecinId'));
        if (Keys.includes('medecinId')){
            const medecin = await UserRepository.getOne(new Types.ObjectId(data.medecinId), res);
            if (!medecin) return res.json({error: 'there is no medecin with this id'});
            rendez.medecinId = data.medecinId;
        }
        if (Keys.includes('patientId')){
            const patient = await UserRepository.getOne(new Types.ObjectId(data.patientId), res);
            console.log('patient--------\n',patient);
            if (!patient) return res.json({error: 'there is no patient with this id'});
            rendez.patientId = data.patientId;
        }
    
        if(Keys.includes('dateStar'))
        if(statusEnum.includes(data.status)){
            rendez.status = data.status;
        }
    
        if(Keys.includes('dateStar')){
            rendez.dateStar = data.dateStar;
        }
        if(Keys.includes('dateFine')){
            rendez.dateFine = data.dateFine;
        }
        if(Keys.includes('cause')){
            rendez.cause = data.cause;
        }
        await rendez.save();
        return res.json({rendez});
        
    } catch (error) {
        return res.json({error});
    }
}