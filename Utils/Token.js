require('dotenv').config();
const jwt = require('jsonwebToken');

exports.geanerateAccessToken = (user) => {
    return jwt.sign(
        {id: user._id, roleId: user.roleId, firstName: user.firstName, lastName: user.lastName},
        process.env.ACCESS_SECRET,
        { expiresIn: "10m"}
    );
}

export const generateRefreshToken = function (user) {
    return jwt.sign(
        { id: user._id, roleId: user.roleId, name: user.name },
        process.env.REFRESH_SECRET,
        { expiresIn: "15d" }
    );
};
