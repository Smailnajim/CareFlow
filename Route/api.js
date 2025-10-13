require('dotenv').config();
const express = require('express');
const router = express.Router();
const { register, login, refreshTokens } = require('./../Controller/AuthController');
const touteMiddelware = require('./../middleware');

router.post('/register', function(req, res) {
    register(req, res);
});

router.post('/login', function (req, res) {
    login(req, res);
});




router.post('/refresh', refreshTokens(req, res));





router.get('/test', touteMiddelware.isAuth, function (req, res) {
    const u = req.user;
    return res.json({ message: 'heeeellllloooo', u });
});

module.exports = router;