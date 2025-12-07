require('dotenv').config();
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    console.log('a**********\n');
    const accessauth = req.headers['authorization'];
    const token = accessauth && accessauth.split(' ')[2];
    if (!token) return res.json({message: 'there is no access token'});


    console.log('Token:', token);
    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) {
            console.log(err, '\n-----****',user);
            return res.json({ message: 'expired token' });
        }
        req.user = user;
        next();
    });
}