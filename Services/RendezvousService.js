const User = require('./../Models/User');
const RoleRepository = require('./../Repositories/RoleRepository');
const RendezvousRepository = require('./../Repositories/RendezvousRepository');
const {Types} = require('mongoose');
const {matchedData} = require('express-validator');
const UserRepository = require('./../Repositories/UserRepository');
const statusEnum = require('./../Enum/RendezvouStatus');


exports.CreerUnRendezvous = async (rendezData) => {
    const roleauth = await RoleRepository.roleDeUser(rendezData.authId);
    console.log(roleauth[0].roleName,rendezData.patientId, '\nvs\n',rendezData.authId)
    if(roleauth.length == 0) throw new Error('may be you are not connect');
    if ((roleauth[0].roleName == 'patient') && (rendezData.patientId != rendezData.authId))
        throw new Error('you cant create a rendez for anthor one');
    
    const roleMedecin = await RoleRepository.roleDeUser(rendezData.medecinId);
    console.log(roleMedecin, roleMedecin[0].roleName )
    if(roleMedecin.length == 0) throw new Error('may be medecinId is not coorect');
    if (roleMedecin[0].roleName != 'medecin')
        throw new Error(`tis is ${rendezData.medecinId} not a medecin`);
    
    const rolePatient = await RoleRepository.roleDeUser(rendezData.patientId);
    console.log(rolePatient, rolePatient[0].roleName)
    if(rolePatient.length == 0 ) throw new Error('may be patientId is not coorect');
    if (rolePatient[0].roleName != 'patient')
        throw new Error(`this is ${rendezData.patientId} not patient`);
        
    rendezData.status = 'created';

    const rendez = await RendezvousRepository.createRendezvou(rendezData);
    console.log('****\n', rendez);
    return rendez;
}

exports.medecinsDisponibilites = async (req, res) => {
    const Disponibilites = await RendezvousRepository.medecinsDisponibilites(req, res);
    return Disponibilites;
}

exports.VoirTousLesRendezVousDeLaClinique = async () => {
    const touteRendezvous = await RendezvousRepository.VoirTousLesRendezVousDeLaClinique();
    if (touteRendezvous.length == 0) throw new Error('there is no rendezvous in the clinic');
    return touteRendezvous;
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
    try {
        const rendez = await RendezvousRepository.getRendezvousById(new Types.ObjectId(data.rendezvousId));
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
    
        if(Keys.includes('dateFine')){
            rendez.dateFine = data.dateFine;
        }
        if(Keys.includes('cause')){
            rendez.cause = data.cause;
        }
        if(Keys.includes('status')){
            if(rendez.status == 'complete') return res.json({error: 'you cant change status of complete rendezvou'});
            if(data.status == 'complete') return res.json({error: 'if you want change status to complete you nedd to create a tritment to this rendezvou'});
            rendez.status = data.status;
        }
        await rendez.save();
        return res.json({rendez});
        
    } catch (error) {
        return res.json({error});
    }
}