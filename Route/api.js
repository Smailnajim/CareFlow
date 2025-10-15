require('dotenv').config();
const express = require('express');
const router = express.Router();
const { register, login, refreshTokens } = require('./../Controller/AuthController');
const {getAll, getAllHasRole, createUser, CompteStatus} = require('./../Controller/UserController');
const touteMiddelware = require('./../middleware');

const {body, validationResult} = require('express-validator');

router.get('/all/:roleName', getAllHasRole);


router.post(
    '/register',
    [
        // {firstName, lastName, email, password}
        body('email').isEmail().withMessage('email is not corect').escape(),
        body('password').isLength({min: 6}).withMessage('password must be greet thenor equal 6 charachters'),
        body('firstName').trim().notEmpty().withMessage('first name must be not empty').escape(),
        body('lastName').trim().notEmpty().withMessage('last name must be not empty').escape(),
    ],

    function(req, res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.json({errors})
        }
        register(req, res);
});

router.post('/login',
    [
        body('email').isEmail().withMessage('email is not corect'),
        body('password').isLength({min: 6}).withMessage('password must be great then or equal 6 char'),
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({errors});

        login(req, res);
});

router.post('/refresh', function(req, res){
    refreshTokens(req, res)
});


router.get('/test', touteMiddelware.isAuth, function (req, res) {
    const u = req.user;
    return res.json({ message: 'heeeellllloooo', u });
});

//admin
//->Créer des comptes
router.post('/create/user', createUser);

//->Suspendre ou réactiver des comptes
router.put('/comptes-status',
    [
        body('status').trim().notEmpty().withMessage('you must select a status'),
        body('userId').notEmpty().withMessage('select user')
    ],
    CompteStatus
);
module.exports = router;