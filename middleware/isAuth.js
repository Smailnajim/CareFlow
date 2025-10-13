require('dotenv').config();
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[2];
    if (!token) return res.json({ message: 'there is no token' });

    // console.log(token, '\n-----');
    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) {
            console.log(err, '\n-----');
            return res.json({ message: 'expired token' });
        }
        req.user = user;
        next();
    });
}