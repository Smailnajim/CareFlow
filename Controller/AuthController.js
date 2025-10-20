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
        const user = await User.findOne({refreshTokens: tokenToRefresh});     
        jwt.verify(tokenToRefresh, process.env.REFRESH_SECRET, (er, decoded)=>{
            if (er) {
                console.log('error -----\n', er);
                return res.json({error: 'your refresh token is expired'})
            }

            const access = geanerateAccessToken(user);
            return res.json({newAccess: access});
        })
    } catch (error) {
        console.log('\nerrror\n', error);
    }
}