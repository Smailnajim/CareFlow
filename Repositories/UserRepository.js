const { Types } = require('mongoose');
const User = require('./../Models/User');
const Role = require('../Models/Role');


exports.getOneById = async (userId) => {
    try {
        console.log('start user\n');
        const user = await User.findById(userId);
    
        console.log('user--------\n',user);
        if(!user) return res.json({error: `no yoser has id: ${req.params.id}`});
    
        const role = await Role.findById(user.roleId);
        if(!role) return res.json({error: 'there is no role has id '+user.roleId});
        
        return {
            id: user._id,
            role: role.name,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            status: user.status
        };
        
    } catch (error) {
        return res.json({error});
    }
}
exports.getUsersByRoleId = async (roleId) => {
    return await User.find({roleId: roleId});
}
exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
}
exports.getAllUsers = async () => {
    return await User.find();
}
exports.deleteById = async (userId) => {
    return await User.findByIdAndDelete(userId);
}
exports.updateById = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, {new: true});
}
exports.getOneByEmail = async (email) => {
    return await User.findOne({email: email});
}
exports.whoHaseRefresh = async (refreshToken) => {
    return await User.findOne({refreshTokens: refreshToken});
}
exports.userProfile = async(userId) => {
    return await User.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(userId)
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
                    password: 0,
                    refreshTokens: 0
                }
            }
        ]);
}