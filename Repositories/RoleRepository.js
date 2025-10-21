const Role = require('./../Models/Role');
const User = require('./../Models/User');
const {Types} = require('mongoose');


exports.roleDeUser = async (id) => {

        return await User.aggregate([
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
            },{ $unwind: '$role' }
            ,{
                $project: {
                    roleName: '$role.name',
                }
            }
            ]);
        // console.log('roole****\n', JSON.stringify(role));
        // return role[0].role[0].name; ex: [{"_id":"68f0e9fe5f90a12e56122a42","roleName":"role.name"}]

}
exports.getByName = async (roleName) => {
    return await Role.findOne({name: roleName});
}
exports.getById = async (roleId) => {
    return await Role.findById(roleId);
}