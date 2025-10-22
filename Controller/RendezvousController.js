const { matchedData } = require('express-validator');
const Rendezvous = require('./../Models/RendezVous');
const User = require('./../Models/User');
const RendezvousService = require('./../Services/RendezvousService');
const UserService = require('./../Services/UserService');


//create
{
exports.CreerUnRendezvousPourPatient = async (req, res) => {
    const rendezData = matchedData(req, {locations: ['body']});
    console.log('***\n',rendezData);
    // rendezData.authId = req.user._id; //patient user can't create a rendez for anthor one
    rendezData.authId = rendezData.patientId;
    console.log('***\n',rendezData.authId);
    try {
        const rendezvou = await RendezvousService.CreerUnRendezvous(rendezData);
        return res.json({rendezvou});
    } catch (error) {
        return res.json({error: error.message});
    }
}
}

//reade
{
exports.medecinsDisponibilites = async (req, res) => {
    try {
        const Disponibilites = await RendezvousService.medecinsDisponibilites();
        return res.json({Disponibilites});
    } catch (error) {
        return res.json({error: Disponibilites});
    }
}

exports.VoirTousLesRendezVousDeLaClinique = async (req, res) => {
    try {
        const touteRendezvous = await RendezvousService.VoirTousLesRendezVousDeLaClinique();
        return res.json({touteRendezvous});
    } catch (error) {
        return res.json({error: error.message});
    }
}
}

//update
{
    exports.changeStatusRendezvous = async (req, res) => {
        const data = matchedData(reportWebVitals, {locations: ['params']});
        try {
            RendezvousService.changeStatusRendezvous(data);
        } catch (error) {
            
        }
    }
    exports.updateRendez = async (req, res) => {
    const data = matchedData(req, {locations: ['body', 'params']});
        try {
            const rendez = await RendezvousService.updateRendez(data);
            return res.json(rendez);
        } catch (error) {
            return res.json({error: error.message});
        }
    }
}