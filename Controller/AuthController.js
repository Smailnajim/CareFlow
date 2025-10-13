const User = require('./../Models/User');
const Role = require('./../Models/Role');
const {geanerateAccessToken, generateRefreshToken} = require('./../Utils/Token');

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
        const roleId = await Role.findOne({name: 'Patient'});

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

    return res
    .cookie('refreshToken', Refresh, { httpOnly: true, secure: true, sameSite: 'strict' })
    .json({ accessToken: Access });
}