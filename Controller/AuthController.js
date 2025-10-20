require('dotenv').config();
const {geanerateAccessToken, generateRefreshToken} = require('./../Utils/Token');
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
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.send('error', 'email or password not corect');
    }

    const compar = await user.comparePassword(password);
    if(!compar){
        return res.send('error', 'email or password not corect');
    }
    const Access = geanerateAccessToken(user);
    const Refresh = generateRefreshToken(user);

    user.refreshTokens.push(Refresh);
    user.save();

    req.session.user = user;
    console.log(req.session.user);

    return res
    .cookie('refreshToken', Refresh, { httpOnly: true, secure: true, sameSite: 'strict' })
    .json({ accessToken: Access });
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