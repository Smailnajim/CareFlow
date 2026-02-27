require('dotenv').config();
const mongoose = require('mongoose');
const RoleService = require('../Services/RoleService');

const initRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        await RoleService.initializeRolesWithPermissions();
        
        console.log('Roles initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

initRoles();
