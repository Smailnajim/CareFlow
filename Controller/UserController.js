const Role = require('../Models/Role');
const User = require('./../Models/User');
const {Types} = require('mongoose');


//create
exports.createUser = async (req, res) => {
    try {
        console.log('--------\n');
        
        await User.create({
            roleId: new Types.ObjectId('68ec1f6e918d473d23cebea4'),
            firstName: 'ana',
            lastName: 'ana',
            email: 'ti@g.com',
            password: "1230",
            status: "active",
        })
    } catch (error) {
        console.log('--------\n', error);
    }
}
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

//reade
exports.getAll = async () => {
    try {
        const users = await User.find();
        console.log('-----\n', users);
    } catch (error) {
        console.log('-----\n', error);
    }
}
exports.getOne = async (req, res) => {
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


//delete
exports.deletUserById = async (id) => {
    var id = parseInt(id);

    try {
        await User.findByIdAndDelete(id);
        return res.json({valid: "delete user successfly"});
    } catch (err) {
        return res.json({error: "delete user is bad :) becouse: "+err});
    }
}


// Update
// exports.updateById = async (data) => {
//     const keys = Object.keys(data);

// }