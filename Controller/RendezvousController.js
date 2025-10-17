const Rendezvous = require('./../Models/RendezVous');
const User = require('./../Models/User');
const RendezvousService = require('./../Services/RendezvousService');
const UserService = require('./../Services/UserService');
const {matchedData} = require('express-validator');


//create
{
exports.CreerUnRendezvousPourPatient = async (req, res) => {
    const rendezvou = await RendezvousService.CreerUnRendezvousPourPatient(req, res);
    return res.json({rendezvou});
}
}
