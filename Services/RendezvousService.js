const User = require('./../Models/User');
const RoleRepository = require('./../Repositories/RoleRepository');
const RendezvousRepository = require('./../Repositories/RendezvousRepository');
const {Types} = require('mongoose');
const {matchedData} = require('express-validator');
const UserRepository = require('./../Repositories/UserRepository');
const statusEnum = require('./../Enum/RendezvouStatus');
const TimeService = require('./TimeService');


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

exports.medecinsDisponibilites = async () => {
    const Disponibilites = await RendezvousRepository.medecinsDisponibilites();
    console.log();
    if (Disponibilites.length == 0) throw new Error('ther is no medecin in thece clinic :(');
    return Disponibilites;
}

exports.VoirTousLesRendezVousDeLaClinique = async () => {
    const touteRendezvous = await RendezvousRepository.VoirTousLesRendezVousDeLaClinique();
    if (touteRendezvous.length == 0) throw new Error('there is no rendezvous in the clinic');
    return touteRendezvous;
}

exports.changeStatusRendezvous = async (data) => {
    const rendezvousId = new Types.ObjectId(data.rendezvousId);
    const rendezvous = await RendezvousRepository.getRendezvousById(rendezvousId);
    if(!rendezvous) throw new Error('rendezvous not found');

    if (rendezvous.status == 'complete') throw new Error('you cant update status from complete');
    if (data.status == 'complete') throw new Error('you cant update status to complete *if you want add tritment to ');
    rendezvous.status = data.status;
    await rendezvous.save();
    return rendezvous;

}

exports.updateRendez = async (data) => {

    const Keys = Object.keys(data);
        const rendez = await RendezvousRepository.getRendezvousById(new Types.ObjectId(data.rendezvousId));
        if (!rendez) throw new Error(`there is no rendez has this id: ${data.rendezvousId}`);

        if (Keys.includes('medecinId')){
            const medecin = await RoleRepository.roleDeUser(data.medecinId);
            if (medecin.length == 0) throw new Error('there is no medecin with this id');
            if (medecin[0].roleName != 'medecin') throw new Error(`you want update medecin with user not a medecin this is not medcin: ${data.medecinId}`);
            rendez.medecinId = data.medecinId;
        }
        if (Keys.includes('patientId')){
            const patient = await RoleRepository.roleDeUser(data.patientId);
            if (patient.length == 0) throw new Error('there is no patient with this id');
            if (patient[0].roleName != 'patient') throw new Error(`you want update patient with user not a patient this is not patient: ${data.patientId}`);
            rendez.patientId = data.patientId;
        }
    
        if(Keys.includes('dateStar') && Keys.includes('dateFine')){
            rendez.dateStar = data.dateStar;
            rendez.dateFine = data.dateFine;
            await TimeService.checkRendezTime(rendez.dateStar, rendez.dateFine);
            // try {
            //     await TimeService.checkRendezTime(rendez.dateStar, rendez.dateFine)
            // } catch (error) {
            //     throw new Error(error.message);
            // }
        }


        if(Keys.includes('cause')){
            rendez.cause = data.cause;
        }
        if(Keys.includes('status')){
            if(rendez.status == 'complete') throw new Error('you cant change status From a status complete. *JUST WHEN ADD A TRITMENT');
            if(data.status == 'complete') throw new Error('you cant change status to complete rendezvou *JUST WHEN ADD A TRITMENT');
            rendez.status = data.status;
        }

        const rendezUp = await RendezvousRepository.updateRendez(rendez);
        if(!rendezUp) throw new Error('there is a error at upditing');
        return rendezUp;
}