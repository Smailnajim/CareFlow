const RoleService = require('./RoleService');
const UserRepository = require('./../Repositories/UserRepository');
const Token = require('./../Utils/Token');
exports.getAllHasRole = async (roleName) => {
    const role = await RoleService.getRoleByName(roleName);
    const users = await UserRepository.getUsersByRoleId(role._id);
    if (users.length == 0) throw new Error('there is no users with role: '+roleName);
    return users;
}

exports.register = async (userData) => {
    const role = await RoleService.getRoleByName(userData.roleName ?? 'patient');
    userData.roleId = role._id;
    userData.status = 'active';
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