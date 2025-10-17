const Role = require('../Models/Role');
const User = require('./../Models/User');
const RendezVous = require('./../Models/RendezVous');
const {Types} = require('mongoose');
const userStatus = require('../Enum/Status');

const {matchedData, validationResult} = require('express-validator');

//create
{
var createUser = async (req, res) => {
    try {
        console.log('--------\n');
        const {roleName, firstName, lastName, email, password} = req.body;
        
        const role = await Role.findOne({name: roleName});
        if(!role) res.json({error: 'ther is no role has name: '+roleName});

        await User.create({
            roleId: role._id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            status: "active",
        });
        res.json({valid: 'create user seccessfly ;)'});
    } catch (error) {
        console.log('--------\n', error);
    }
}
var createUsers = async (req, res) => {
    try {
        await User.insertMany([
            {
                roleId: new Types.ObjectId('68ec1f6e918d473d23cebea4'),
                firstName: 'ana',
                lastName: 'ana',
                email: 't@g.com',
                password: "1230",
                status: "active",
            },
            {
                roleId: new ObjectId('68ec1f6e918d473d23cebea4'),
                firstName: 'ana',
                lastName: 'ana',
                email: 't@g.com',
                password: "1230",
                status: "active",
            },
    ])
    } catch (error) {
        console.log('--------\n', error);
    }
}
}

//reade
{
var getAll = async () => {
    try {
        const users = await User.find();
        console.log('-----\n', users);
    } catch (error) {
        console.log('-----\n', error);
    }
}
var getOne = async (req, res) => {// .../:id
    const user = await User.findById(req.params.id);

    if(!user) return res.json({error: `no yoser has id: ${req.params.id}`});

    const role = await Role.findById(user.roleId);
    if(!role) return res.json({error: 'there is no role has id '+user.roleId});
    
    return res.json({
        id: user._id,
        role: role.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        status: user.status
    });
}
var filterByRole = async (req, res) => {
    const {roleName} = req.params;

    const role = await Role.findOne({name: roleName});
    if(!role) return res.json({error: 'no rol : '+roleName})
    
    const users = await User.find({roleId: role._id});

    return res.json({users: users});
}
var patientHasRendezvous = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'rendezvous',
                    localField: '_id',
                    foreignField: 'patientId',
                    as: 'tousRendezvous'
                }
            },
            {
                $match: {'tousRendezvous.0': { $exists: true }}
            }
        ]);
        return res.json({users});
    } catch (error) {
        console.log(error,'\n----');
        return res.json({error});
    }
}
var VoirTousLesRendezVousDeLaClinique = async (req, res) => {
    try {
        const tousRendezVous = await RendezVous.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'medecinId',
                    foreignField: '_id',
                    as: 'medecin'
                }
            },{
                $lookup: {
                    from: 'users',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },{
                $project: {
                    'medecin.password': 0,
                    'patient.password': 0,
                }
            }
        ]);
        return res.json({tousRendezVous});
    } catch (error) {
        return res.json({error});
        
    }
}
var ConsulterProfilCompletPatient = async (req, res) => {
    let {id} = req.params;
    console.log('-----\n', id);
    // id = parseInt(id);
    try {
        // const user = await User.findOne({_id: id})
        const user = await User.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            },{
                $lookup: {
                    from: 'roles',
                    localField: 'roleId',
                    foreignField: '_id',
                    as: 'role'
                }
            },{
                $lookup: {
                    from: 'rendezVous',
                    localField: '_id',
                    foreignField: 'patientId',
                    as: 'mesRendezvous'
                }
            },{
                $lookup: {
                    from: 'tritments',
                    localField: 'mesRendezvous._id',
                    foreignField: 'rendezVousId',
                    as: 'tritment'
                }
            },{
                $lookup: {
                    from: 'notifications',
                    localField: 'mesRendezvous._id',
                    foreignField: 'rendezVousId',
                    as: 'notifications'
                }
            },{
                $project: {
                    'password': 0,
                }
            }
        ]);
        return res.json({user: user});
    } catch (error) {
        console.log(error);
        return res.json({ff: error});
    }
}
} 

//delete
{
var deletUserById = async (id) => {
    var id = parseInt(id);

    try {
        await User.findByIdAndDelete(id);
        return res.json({valid: "delete user successfly"});
    } catch (err) {
        return res.json({error: "delete user is bad :) becouse: "+err});
    }
}
}

// Update
{
var CompteStatus = async (req, res) => {
    const {status, userId} = matchedData(req, {location: ['body']});

    if (!userStatus.includes(status)) return res.json({error: `you must chois one of :${[...userStatus]}`});
    try {
        const user = await User.findById(userId);
        if (!user) return res.json({error: 'ther is no user has '+ userId});

        user.status = status;
        user.save();
        return res.json({valid: 'update status to '+status+' by seccessfly'});
        
    } catch (er) {
        return res.json({error: er});
    }
}
}

module.exports = {
    createUser,
    createUsers,
    getAll,
    getOne,
    filterByRole,
    patientHasRendezvous,
    VoirTousLesRendezVousDeLaClinique,
    deletUserById,
    CompteStatus,
    ConsulterProfilCompletPatient
}