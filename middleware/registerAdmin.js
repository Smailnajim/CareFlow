module.exports = async (req, res, next) => {

    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.json({ error: 'Admins only.' });
};