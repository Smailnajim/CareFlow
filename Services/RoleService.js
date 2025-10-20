const RoleRepository = require('./../Repositories/RoleRepository');
const UserRepository = require('../Repositories/UserRepository');

exports.getRoleByName = async (roleName) => {
    roleName = roleName.toLowerCase();
    const role = await RoleRepository.getByName(roleName);
    if(!role) throw new Error('there is no role has name: '+roleName);
    return role;
}

exports.getRoleById = async (roleId) => {
        const role = await RoleRepository.getById(roleId);
        if(!role) throw new Error('there is no role has id: '+roleId);
        return role;
}