const User = require('../Models/User');
const Rendezvous = require('./../Models/RendezVous');
const {Types} = require('mongoose');

exports.createRendezvou = async (data) => {
    try {
        
        return await Rendezvous.create({
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

exports.medecinsDisponibilites = async (req, res) => {
    const Disponibilites = await User.aggregate([
        {
            $lookup: {
                from: 'roles',
                localField: 'roleId',
                foreignField: '_id',
                as: 'role'
            }
        },{
            $match: {
                'role.name': 'medecin'
            }
        },{
            $lookup: {
                from: 'rendezvous',
                localField: '_id',
                foreignField: 'medecinId',
                as: 'rendezvous'
            }
        },{
            $lookup: {
                from: 'timesworks',
                localField: '_id',
                foreignField: 'medecinId',
                as: 'timesworks'
            }
        },{
            $addFields:{
                iWantFirst: {
                    // $cond: [{$eq:['$_id', req.user._id]}, 1, 0]
                    $cond: [{$eq:['$_id', new Types.ObjectId('68ec3d11a67f6d5bbff95279') ]}, 1, 0]
                }
            }
        },{
            $sort: {
                iWantFirst: -1
            }
        },{
            $project: {
                'password': 0,
            }
        }
    ]);
    return Disponibilites;
}

exports.VoirTousLesRendezVousDeLaClinique = async (req, res) => {
    try {
        const tousRendezVous = await Rendezvous.aggregate([
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
                    'medecin.refreshTokens': 0,
                    'patient.password': 0,
                    'patient.refreshTokens': 0,
                }
            }
        ]);
        return res.json({tousRendezVous});
    } catch (error) {
        return res.json({error});
        
    }
}