const RoleService = require('./RoleService');
const UserRepository = require('./../Repositories/UserRepository');

exports.getAllHasRole = async (roleName) => {
    const role = await RoleService.getRoleByName(roleName);
    const users = await UserRepository.getUsersByRoleId(role._id);
    if (users.length == 0) throw new Error('there is no users with role: '+roleName);
    return users;
}
