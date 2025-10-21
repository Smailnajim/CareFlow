const User = require('../Models/User');
const Rendezvous = require('./../Models/RendezVous');
const {Types} = require('mongoose');

exports.createRendezvou = async (data) => {
        return await Rendezvous.create(data);
}

exports.medecinsDisponibilites = async () => {
    return await User.aggregate([
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
}

exports.VoirTousLesRendezVousDeLaClinique = async () => {
    return await Rendezvous.aggregate([
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
}

exports.getRendezvousById = async (rendezvousId) => {
    try {
        const rendez = await Rendezvous.findById(rendezvousId);
        if (!rendez) return res.json({error: 'there is an error this rendezvou not found or id not corect'});
        return rendez;
    } catch (error) {
        return res.json({error});
    }
}

exports.whoHasRendezAfter24And25 = async () => {
    try {
        const now = new Date();
        const next24h = new Date(now.getTime() + 86400000);// 24h =>86 400 000 ms
        console.log('22222222222222\n------------***-------------\nChecking for rendezvous to notify at:', now);
        console.log('\n------------***-------------\nNext 24 hours window starts at:', next24h);
        const users = await Rendezvous.aggregate([
            {
                $match: {
                    dateStar: {
                        $gte: next24h,
                        $lt: new Date(next24h.getTime() + 3600000)
                    }
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
                    dateStar: 1,
                    dateFine: 1,
                    'patient.email': 1,
                    'patient.firstName': 1,
                    'patient.lastName': 1,
                    'patient.phone': 1,
                    'patient.status': 1,
                }
            }
        ]);
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
}