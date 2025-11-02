const Role = require('../Models/Role');
const RolePermissions = require('../Enum/RolePermissions');

exports.initializeRolesWithPermissions = async () => {
    try {
        for (const [roleName, permissions] of Object.entries(RolePermissions)) {
            await Role.findOneAndUpdate(
                { name: roleName },
                { permissions },
                { upsert: true, new: true }
            );
        }
        console.log('Roles initialized with permissions');
    } catch (error) {
        console.error('Error initializing roles:', error.message);
    }
};

exports.getRoleByName = async (roleName) => {
    return await Role.findOne({ name: roleName });
};

exports.getRoleById = async (roleId) => {
    return await Role.findById(roleId);
};
