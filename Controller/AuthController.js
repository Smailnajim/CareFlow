require('dotenv').config();
const User = require('./../Models/User');
const Role = require('./../Models/Role');
const {geanerateAccessToken, generateRefreshToken} = require('./../Utils/Token');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    
    try {
        const {firstName, lastName, email, password} = req.body;
        
        if(!firstName || !lastName || !email || !password){
            return res.send({'error': 'one or many filed not exist'});
        }
        
        const alredyExist = await User.findOne({email});
        if (alredyExist) {
            return res.send({'error': 'this email exist'});
        }
    
        console.log('zzz');
        const roleId = await Role.findOne({name: 'Patient'}).select('_id');
        console.log('zzz\n', roleId);

        if(!roleId){
            return res.status(500).send({'error': roleId});
        }
    
        const user = new User({roleId, firstName, lastName, email, password, status: "active"});
        await user.save();
    
        return res.status(200).json({valid: 'create user by good'});
    } catch (error) {
        console.log('errrrrrror', error);
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