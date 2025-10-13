const isAuth = require('./isAuth');

const touteMiddelware = {};

touteMiddelware.isAuth = isAuth;

module.exports = touteMiddelware;