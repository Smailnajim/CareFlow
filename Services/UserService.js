const RoleService = require('./RoleService');
const UserRepository = require('./../Repositories/UserRepository');
const Token = require('./../Utils/Token');
const Role = require('../Models/Role');




exports.getAllHasRole = async (roleName, userRoleId) => {
    const requestedRole = await RoleService.getRoleByName(roleName);
    const userRole = await RoleService.getRoleById(userRoleId);
    
    if (roleName == 'admin' && userRole.name != 'admin') {
        throw new Error('Only admin can filter admin users');
    }
    
    const users = await UserRepository.getUsersByRoleId(requestedRole._id);
    if (users.length == 0) throw new Error('there is no users with role: '+roleName);
    return users;
}

exports.register = async (userData) => {
    let role = await RoleService.getRoleByName(userData.roleName);
    
    if(!role) {
        await RoleService.initializeRolesWithPermissions();
        role = await RoleService.getRoleByName('patient');
    }
    
    userData.roleId = role._id;
    userData.status = 'active';
    delete userData.roleName;

    const user = await UserRepository.createUser(userData);
    if (!user) throw new Error('error at create user');
    return user;
}

exports.login = async (email, password) => {
    const user = await UserRepository.getOneByEmail(email);
    if(!user) throw new Error('email or password not corect');
    const compar = await user.comparePassword(password);
    if(!compar) throw new Error('email or password not corect');

    if (user.status == 'suspended'){
        error = new Error('your account is suspended, please contact the administration');
        return error;
    }

    const Access = Token.geanerateAccessToken(user);
    const Refresh = Token.generateRefreshToken(user);

    user.refreshTokens.push(Refresh);
    user.save();
    return {Access, Refresh};
}

exports.verifyRefreshToken = (token) => {
    UserRepository.whoHaseRefresh(token);
    try {
        const payload = Token.verifyRefreshToken(token);
        console.log('*payload****\n', payload);
    
        const access = Token.geanerateAccessToken(payload);
        return access;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.updateUser = async (userData, userID) => {
    console.log('**********\n', userData);
    console.log('**********\n', userData.userId);
    userData.roleName = userData.roleName.toLowerCase();
    const ADMIN = RoleService.getRoleById(userID);
    if (ADMIN.name !== 'admin' && userData.roleName == 'admin') {
        throw new Error('only Admins can assign admin role to a user');
    }

    const user = await UserRepository.updateById(userData.userId, userData);
    if (!user) throw new Error('there is no user updated check if Done');
}

exports.ConsulterProfilCompletPatient = async(userId, authUser) => {
        const role = await RoleService.getRoleById(authUser.roleId);
        
        if (role.name == 'patient' && authUser._id.toString() != userId) {
            throw new Error('Patients can only view their own profile');
        }
        
        const profile = await UserRepository.userProfile(userId);
        if (profile.length == 0) throw new Error('ther is no one has this id!');
        return profile;
    }

exports.deleteUser = async(userId) => {
    const user = await UserRepository.deleteById(userId);
    if (!user) throw new Error('user not found');
    return user;
}

exports.initRoles = async() => {
    const RoleService = require('./RoleService');
    await RoleService.initializeRolesWithPermissions();
}