require('dotenv').config();
const jwt = require('jsonwebToken');

exports.geanerateAccessToken = (user) => {
    return jwt.sign(
        {id: user._id, roleId: user.roleId, email: user.email,firstName: user.firstName, lastName: user.lastName},
        process.env.ACCESS_SECRET,
        { expiresIn: "10m"}
    );
}

exports.generateRefreshToken = function (user) {
    return jwt.sign(
        {id: user._id, roleId: user.roleId, email: user.email,firstName: user.firstName, lastName: user.lastName},
        process.env.REFRESH_SECRET,
        { expiresIn: "15d" }
    );
};

exports.verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        return decoded;
    } catch (error) {
        console.log('Token\n');
        throw new Error('invalid refresh token');
    }
};