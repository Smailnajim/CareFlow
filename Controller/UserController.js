const {Types} = require('mongoose');
const {matchedData, validationResult} = require('express-validator');
const UserService = require('./../Services/UserService');

//create
{
exports.createUsers = async (req, res) => {
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
exports.getAll = async () => {
    try {
        const users = await User.find();
        console.log('-----\n', users);
    } catch (error) {
        console.log('-----\n', error);
    }
}
exports.getOne = async (req, res) => {// .../:id
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
exports.filterByRole = async (req, res) => {
    const {roleName} = matchedData(req, {locations: ['params']});
    console.log('-----\n', roleName);

    try {
        const users = await UserService.getAllHasRole(roleName);
        return res.json({users: users});
    } catch (error) {
        return res.json({error: error.message});
    }
}
exports.patientHasRendezvous = async (req, res) => {
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

exports.ConsulterProfilCompletPatient = async (req, res) => {
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
                    foreignField: 'rendezvousId',
                    as: 'tritment'
                }
            },{
                $lookup: {
                    from: 'notifications',
                    localField: 'mesRendezvous._id',
                    foreignField: 'rendezvousId',
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
exports.deletUserById = async (id) => {
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
exports.CompteStatus = async (req, res) => {
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