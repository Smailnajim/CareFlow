const Rendezvous = require('./../Models/RendezVous');
const User = require('./../Models/User');
const RendezvousService = require('./../Services/RendezvousService');
const UserService = require('./../Services/UserService');


//create
{
exports.CreerUnRendezvousPourPatient = async (req, res) => {
    const rendezvou = await RendezvousService.CreerUnRendezvousPourPatient(req, res);
    return res.json({rendezvou});
}
}

//reade
{
exports.medecinsDisponibilites = async (req, res) => {
    const Disponibilites = await RendezvousService.medecinsDisponibilites(req, res);
    return res.json({Disponibilites});
}

exports.VoirTousLesRendezVousDeLaClinique = async (req, res) => {
    RendezvousService.VoirTousLesRendezVousDeLaClinique(req, res);
}
}

//update
{
    exports.changeStatusRendezvous = async (req, res) => {
        RendezvousService.changeStatusRendezvous(req, res);
    }
    exports.updateRendez = (req, res) => {
        RendezvousService.updateRendez(req, res);
    }
}