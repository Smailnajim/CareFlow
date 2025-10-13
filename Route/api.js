const express = require('express');
const router = express.Router();
const {register, login} = require('./../Controller/AuthController');

router.post('/register', function(req, res){
    register(req, res);
});
router.post('/login', function(req, res){
    login(req, res);
});

router.get('/test', function(req ,res){
    return res.json({message: 'heeeellllloooo'});
});

module.exports = router;