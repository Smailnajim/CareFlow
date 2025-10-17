const Role = require('./../Models/Role');
const User = require('./../Models/User');
const {Types} = require('mongoose');


exports.roleDeUser = async (id) => {
    try {
        const role = await User.aggregate([
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
                $project: {
                    'role.name': 1,
                }
            }
        ]);
        // console.log('****\n', JSON.stringify(role));
        return role[0].role[0].name;
    } catch (error) {
        console.log('eerr****\n', error);
        
    }

}