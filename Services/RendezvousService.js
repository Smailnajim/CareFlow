const User = require('./../Models/User');
const RendezVous = require('./../Models/RendezVous');
const UserService = require('./UserService');

exports.CreerUnRendezvousPourPatient = async (req, res) => {

    // const role = await UserService.roleDeUser(req.user.roleId);
    const role = await UserService.roleDeUser('68f0e9fe5f90a12e56122a42');
    // console.log(role);
    const data = {};
    data.medecinId = req.body.medecinId;
    data.patientId = req.body.patientId;
    data.dateStar = req.body.dateStar;
    data.dateFine = req.body.dateFine;
    data.cause = req.body.cause;
    if (role == 'Patient') {
        // if  (req.user._id != data.patientId) return res.json({error: 'you cant create rendezvou for another Patient'});
        if  ("68f0e9fe5f90a12e56122a42" != req.body.patientId) return res.json({error: 'you cant create rendezvou for another Patient'});
        data.dateStar = null;
        data.dateFine = null;
    }
    console.log(11);
    try {
        
        return await RendezVous.create({
            medecinId: data.medecinId,
            patientId: data.patientId,
            status: 'created',
            dateStar: data.dateStar,
            dateFine: data.dateFine,
            cause: data.cause
        });
    } catch (error) {
        console.log('eee', error);
    }




}