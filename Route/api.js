require('dotenv').config();
const express = require('express');
const router = express.Router();
const { register, login, refreshTokens } = require('./../Controller/AuthController');
const UserController = require('./../Controller/UserController');
const RendezvousController = require('./../Controller/RendezvousController');
const touteMiddelware = require('./../middleware');
const TritmentsController = require('./../Controller/TritmentsController');

const {body, param, validationResult} = require('express-validator');
//filter
{
router.get('/filter-role/:roleName', 
    [
        param('roleName').trim().notEmpty().withMessage('there is no role param'),
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({errors});
        UserController.filterByRole(req, res);
    }
);
router.get('/tous-rendezvous', RendezvousController.VoirTousLesRendezVousDeLaClinique);
}

router.post('/register',
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


// router.get('/test', touteMiddelware.isAuth, function (req, res) {
//     const u = req.user;
//     return res.json({ message: 'heeeellllloooo', u });
// });

//admin
//->Créer des comptes
router.post('/create/user', UserController.createUser);

//->Suspendre ou réactiver des comptes
router.put('/comptes-status',                   
    [
        body('status').trim().notEmpty().withMessage('you must select a status'),
        body('userId').trim().notEmpty().withMessage('select user')
    ],
    UserController.CompteStatus
);

router.get('/profil/:id',
    [
        param("id").trim().notEmpty().withMessage('there is no param id at url')
    ],
    function(req, res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.json({errors})
        }
    UserController.ConsulterProfilCompletPatient;
    }
);

//create rendezvou
router.post('/create-rendezvou',
    [
        body('medecinId').trim().notEmpty().withMessage('you must select medecin'),
        body('patientId').trim().notEmpty().withMessage("you don't select patient"),
        body('cause').trim().notEmpty().withMessage("what is your cause"),
    ],
    function(req, res){
        const errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()) return res.json({errors});
        console.log(errors.isEmpty());

        RendezvousController.CreerUnRendezvousPourPatient(req, res);
    });

//Vérifier mes disponibilités et celles de mes collègues
router.get('/medecins-disponibilites',
    RendezvousController.medecinsDisponibilites
);


//Modifier ou annuler un rendez-vous
    //  change status-->annuler un rendez-vous
router.put('/change-rendezvous-status',
    [
        body('rendezvousId').trim().notEmpty().withMessage('you must chose a rendezvous'),
        body('status').trim().notEmpty().withMessage('you must provide status'),
    ],
    function(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.json({errors});
        RendezvousController.changeStatusRendezvous(req, res);
    }
);

    //  Modifier un rendez-vous
router.put('/Modifier-rendez',
    [
        body('rendezvousId').isMongoId().withMessage('there is no rendez selected'),
        body('medecinId').optional({checkFalsy: true}).isMongoId().withMessage('maybe this is not metecin'),
        body('patientId').optional({checkFalsy: true}).isMongoId().withMessage('there is no patient'),
        body('status').optional({checkFalsy: true}).trim().notEmpty().escape().withMessage("there is problem in  status's section!"),
        body('dateStar').optional({checkFalsy: true}).isDate().escape().withMessage('error at date of start'),
        body('dateFine').optional({checkFalsy: true}).isDate().escape().withMessage('error at date of fine'),
        body('cause').optional({checkFalsy: true}).trim().notEmpty().withMessage('error at cause')
    ],
    function(req, res){
        const errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()) return res.json({errors}); 

        RendezvousController.updateRendez(req, res);
    }
);

//Marquer un rendez-vous comme complété
router.post('/complete-rendezvous',
    [
        body('rendezvousId').isMongoId().withMessage('you must provide rendezvous id'),
        body('description').trim().notEmpty().withMessage('the description is required'),
    ],
    function(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.json({errors});
        console.log('here---');
        TritmentsController.createATritmentForRendezvou(req, res);
    }
);

//
router.get('/test', RendezvousController.CreerUnRendezvousPourPatient);
module.exports = router;