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

    try {
        const users = await UserService.getAllHasRole(roleName, req.user.roleId);
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
    let {id} = matchedData(req, {locations: ['params']});

    try {
        const profile = await UserService.ConsulterProfilCompletPatient(id);
        return res.json({profile});
    } catch (error) {
        return res.json({error: error.message});
    }
}
} 

//delete
{
exports.deleteUser = async (req, res) => {
    const {userId} = req.params;
    try {
        const user = await UserService.deleteUser(userId);
        if (!user) return res.json({error: 'user not found'});
        return res.json({valid: 'user deleted successfully'});
    } catch (err) {
        return res.json({error: err.message});
    }
}
}

// Update
{
exports.updateUser = async (req, res) => {
    const userData = matchedData(req, {location: ['body', 'params']});
    console.log('***\n', userData);
    console.log('**********\n', userData);
    try {
        await UserService.updateUser(userData, req.user.roleId);

        return res.json({valid: 'updated by seccessfly'});
    } catch (errror) {
        return res.json({error: errror.message});
    }
}
}

// Init roles
exports.initRoles = async (req, res) => {
    try {
        await UserService.initRoles();
        return res.json({valid: 'Roles initialized successfully'});
    } catch (error) {
        return res.json({error: error.message});
    }
}