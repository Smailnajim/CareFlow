const User = require('./../Models/User');
const RoleRepository = require('./../Repositories/RoleRepository');
const RendezvousRepository = require('./../Repositories/RendezvousRepository');

exports.CreerUnRendezvousPourPatient = async (req, res) => {

    // const role = await RoleRepository.roleDeUser(req.user.roleId);
    // console.log(role);
    const data = {};
    data.medecinId = req.body.medecinId;
    data.patientId = req.body.patientId;
    data.dateStar = req.body.dateStar;
    data.dateFine = req.body.dateFine;
    data.cause = req.body.cause;
    
    const role = await RoleRepository.roleDeUser('68f0e9fe5f90a12e56122a42');
    if (role == 'Patient') {
        // if  (req.user._id != data.patientId) return res.json({error: 'you cant create rendezvou for another Patient'});
        if  ("68f0e9fe5f90a12e56122a42" != req.body.patientId) return res.json({error: 'you cant create rendezvou for another Patient'});
        data.dateStar = null;
        data.dateFine = null;
    }

    await RendezvousRepository.createRendezvou(data);
}