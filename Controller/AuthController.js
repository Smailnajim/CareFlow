const User = require('./../Models/User');
const Role = require('./../Models/Role');
const {geanerateAccessToken, generateRefreshToken} = require('./../Utils/Token');

exports.register = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    
    if(!firstName || !lastName || !email || !password){
        return res.send('error', 'one or many filed not exist');
    }
    
    const alredyExist = await User.findOne({email});
    if (alredyExist) {
        return res.send('error', 'this email exist');
    }

    const roleId = await Role.findOne({name: 'Patient'}).select('_id');
    if(!roleId){
        return res.status(500).send('error', 'Default Role Patient not faond');
    }

    const user = new User({roleId, firstName, lastName, email, password, status: "active"});
    await user.save();


}

exports.login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.json('error', 'email or password not corect');
    }

    // const check = await bcrypt.compare(password, user.password);
    // if(!check){
    //     return res.send('error', 'email or password not corect');
    // }

    const compar = await user.comparePassword(password);
    if(!compar){
        return res.json('error', 'email or password not corect');
    }
    const Access = geanerateAccessToken(user);
    const Refresh = generateRefreshToken(user);

    user.refreshTokens.push(Refresh);
    user.save();

    res
    .cookie('refreshToken', Refresh, { httpOnly: true, secure: true, sameSite: 'strict' })
    .json({ accessToken: Access });
}