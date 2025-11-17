const Role = require('../Models/Role');

const iCan = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.roleId) {
                return res.json({ error: 'are you log in' });
            }

            const role = await Role.findById(req.user.roleId);
            if (!role) {
                return res.json({ error: 'Role not found' });
            }

            if (!role.permissions.includes(requiredPermission)) {
                return res.json({error: "are you ok! you can't Broo"});
            }

            next();
        } catch (error) {
            return res.json({ error: error.message });
        }
    };
};

module.exports = iCan;