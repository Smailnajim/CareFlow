require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserService = require('./../Services/UserService');
const {matchedData} = require('express-validator');

exports.register = async (req, res) => {
    const userData = matchedData(req, {locations: ['body']});
    try {
        const user = await UserService.register(userData);
        return res.status(200).json({valid: `register ${user.firstName} is done by seccessflly`});
    } catch (error) {
        return res.json({error: error.message});
    }
}



exports.login = async (req, res) => {
    const {email, password} = matchedData(req, {locations: ['body']});

    try {
        const tokens = await UserService.login(email, password);
        console.log('\ntokens\n', tokens);
        return res
        .cookie('refreshToken', tokens.Refresh, { httpOnly: true, secure: true, sameSite: 'strict' })
        .json({ accessToken: tokens.Access });
    } catch (error) {
        return res.json({error: error.message});
    }
}





exports.refreshTokens = async (req, res) => {
    const tokenToRefresh = req.cookies.refreshToken;
    if (!tokenToRefresh) {
        console.log('re-----\n', tokenToRefresh);
        return res.json({error: 'refresh Token not faound'});
    }

    try {
        const access = UserService.verifyRefreshToken(tokenToRefresh);
        return res.json({accessToken: access});
    } catch (error) {
        return res.json({error: error.message});
    }
}