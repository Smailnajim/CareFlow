require('dotenv').config();
const express = require('express');
const router = express.Router();
const AuthController = require('./../Controller/AuthController');
const UserController = require('./../Controller/UserController');
const RendezvousController = require('./../Controller/RendezvousController');
const touteMiddelware = require('./../middleware');
const TritmentsController = require('./../Controller/TritmentsController');
const { body, param, validationResult } = require('express-validator');
const multer = require('multer');
const minioClient = require('./../Config/minioClient');
const logger = require("./../Utils/Logger");
const PrescriptionController = require('./../Controller/PrescriptionController');
const isAuth = require('./../middleware/isAuth');
const iCan = require('./../middleware/iCan');
const isAdmin = require('./../middleware/isAdmin');
const PERMISSIONS = require('./../Enum/Permissions');

//filter
{
    router.get('/users/filter/:roleName',
        [
            param('roleName').trim().notEmpty().withMessage('there is no role param'),
        ],
        function (req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.json({ errors });
            UserController.filterByRole(req, res);
        }
    );
    router.get('/rendezvous',
        RendezvousController.VoirTousLesRendezVousDeLaClinique
    );
}

router.post('/users/register',
    [
        // {firstName, lastName, email, password}
        body('roleName').optional({ checkFalsy: true }).trim().notEmpty().withMessage('role is require'),
        body('email').isEmail().withMessage('email is not corect').escape(),
        body('password').isLength({ min: 6 }).withMessage('password must be greet thenor equal 6 charachters'),
        body('firstName').trim().notEmpty().withMessage('first name must be not empty').escape(),
        body('lastName').trim().notEmpty().withMessage('last name must be not empty').escape(),
    ],

    function (req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({ errors })
        }
        AuthController.register(req, res);
    });

router.post('/users/login',
    [
        body('email').isEmail().withMessage('email is not corect'),
        body('password').isLength({ min: 6 }).withMessage('password must be great then or equal 6 char'),
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ errors });

        AuthController.login(req, res);
    });

router.post('/users/refresh',
    AuthController.refreshTokens
);

router.post('/init-roles', 
    isAuth, 
    iCan(PERMISSIONS.INIT_ROLES), 
    UserController.initRoles
);


// router.get('/test', touteMiddelware.isAuth, function (req, res) {
//     const u = req.user;
//     return res.json({ message: 'heeeellllloooo', u });
// });

//admin
//->Créer des comptes
// router.post('/create/user',
//     [
//         body('roleName').optional({checkFalsy: true}).trim().notEmpty().withMessage('role is require'),
//         body('firstName').trim().notEmpty().withMessage('first name is require'),
//         body('lastName').trim().notEmpty().withMessage('last name is require'),
//         body('email').trim().notEmpty().isEmail().withMessage('form of this email maybe is bad or som thing worning!'),
//         body('password').trim().notEmpty().isLength({min: 6}).withMessage('check password if it corect'),
//     ],
//     function(){
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) return res.json({errors});
//         UserController.createUser
//     }
// );//create user is register

console.log();
//************************ */
//->Suspendre ou réactiver des comptes
//->update user mem tone
router.put('/users/:userId',
    isAuth,
    iCan(PERMISSIONS.UPDATE_USER),
    [
        param('userId').trim().notEmpty().isMongoId().withMessage('there is no userID'),
        body('status').optional({ checkFalsy: true }).trim().notEmpty().withMessage('you must select a status'),
        body('roleName').optional({ checkFalsy: true }).trim().notEmpty().withMessage('you must select a roleName'),
        body('image').optional({ checkFalsy: true }).trim().notEmpty().withMessage('you must add a image'),
        body('firstName').optional({ checkFalsy: true }).trim().notEmpty().withMessage('you must add a firstName'),
        body('lastName').optional({ checkFalsy: true }).trim().notEmpty().withMessage('you must add a lastName'),
        body('email').optional({ checkFalsy: true }).trim().notEmpty().isEmail().withMessage('is this a email'),
        body('phone').optional({ checkFalsy: true }).trim().notEmpty().withMessage('you must add a phone'),
        body('dateNasonse').optional({ checkFalsy: true }).isDate().withMessage('this is not a dateNasonse'),
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ errors });
        UserController.updateUser(req, res);
    }
);

router.get('/user-profils/:id',
    [
        param("id").isMongoId().withMessage('there is no param id at url')
    ],
    function (req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({ errors });
        }
        UserController.ConsulterProfilCompletPatient(req, res);
    }
);

router.delete('/users/:userId',
    isAuth,
    iCan(PERMISSIONS.DELETE_USER),
    [
        param('userId').isMongoId().withMessage('invalid user id')
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ errors });
        UserController.deleteUser(req, res);
    }
);

//create rendezvou
router.post('/rendezvous',
    isAuth,
    iCan(PERMISSIONS.CREATE_RENDEZVOUS),
    [
        body('medecinId').isMongoId().withMessage('you must select medecin'),
        body('patientId').isMongoId().withMessage("you don't select patient"),
        body('cause').trim().notEmpty().withMessage("what is your cause"),
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ errors });
        RendezvousController.CreerUnRendezvousPourPatient(req, res);
});

//Vérifier mes disponibilités et celles de mes collègues
router.get('/users/time-works',
    // isAuth,
    // isDoctor,
    RendezvousController.medecinsDisponibilites
);


//Modifier ou annuler un rendez-vous
//  change status-->annuler un rendez-vous
router.put('/rendezvous/:rendezId/:status',
    [
        param('rendezId').isMongoId().withMessage('you must chose a rendezvous'),
        param('status').trim().notEmpty().withMessage('you must provide status'),
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ errors });
        RendezvousController.changeStatusRendezvous(req, res);
    }
);

//  Modifier un rendez-vous
router.put('/rendezvous/:rendezId',
    isAuth,
    iCan(PERMISSIONS.UPDATE_RENDEZVOUS),
    [
        param('rendezId').isMongoId().withMessage('there is no rendez selected'),
        body('medecinId').optional({ checkFalsy: true }).isMongoId().withMessage('maybe this is not metecin'),
        body('patientId').optional({ checkFalsy: true }).isMongoId().withMessage('there is no patient'),
        body('status').optional({ checkFalsy: true }).trim().notEmpty().escape().withMessage("there is problem in  status's section!"),
        body('dateStar').optional({ checkFalsy: true }).isDate().escape().withMessage('error at date of start'),
        body('dateFine').optional({ checkFalsy: true }).isDate().escape().withMessage('error at date of fine'),
        body('cause').optional({ checkFalsy: true }).trim().notEmpty().withMessage('error at cause')
    ],
    function (req, res) {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) return res.json({ errors });

        RendezvousController.updateRendez(req, res);
    }
);

router.delete('/rendezvous/:rendezId',
    isAuth,
    iCan(PERMISSIONS.DELETE_RENDEZVOUS),
    [
        param('rendezId').isMongoId().withMessage('invalid rendezvous id')
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ errors });
        RendezvousController.deleteRendezvous(req, res);
    }
);

//Marquer un rendez-vous comme complété
router.post('/tritments/rendesvous/:rendezId',
    isAuth,
    iCan(PERMISSIONS.CREATE_TREATMENT),
    [
        param('rendezId').isMongoId().withMessage('you must provide rendezvous id'),
        body('description').trim().notEmpty().withMessage('the description is required'),
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ errors });
        console.log('here---');
        TritmentsController.createATritmentForRendezvou(req, res);
    }
);

const upload = multer({ storage: multer.memoryStorage() });
//minio
router.post('/files', 
upload.single('file'), async (req, res) => {
    try {
        const bucketName = 'uploads';
        const file = req.file;

        await minioClient.putObject(bucketName, file.originalname, file.buffer);

        res.json({ message: 'uplode by seccessfly TO MinIO!' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'ERROR at uplode MinIO' });
    }
}
);




// Prescription Routes
{
    router.post('/prescriptions',
        isAuth,
        iCan(PERMISSIONS.CREATE_PRESCRIPTION),
        [
            body('patientId').isMongoId().withMessage('patient id is required'),
            body('tritmentId').isMongoId().withMessage('tritment id is required'),
            body('medicaments').isArray().withMessage('medicaments must be an array'),
            body('medicaments.*.name').trim().notEmpty().withMessage('medication name is required'),
            body('medicaments.*.dosage').trim().notEmpty().withMessage('dosage is required'),
            body('medicaments.*.voieAdministration').trim().notEmpty().withMessage('voie administration is required'),
            body('medicaments.*.frequence').trim().notEmpty().withMessage('frequence is required'),
            body('medicaments.*.duree').trim().notEmpty().withMessage('duree is required'),
            body('medicaments.*.renouvellements').isInt().withMessage('renouvellements must be a number'),
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({ errors: errors.array() });
            }
            // next();
            // (req, res) => PrescriptionController.createPrescription(req, res)
            PrescriptionController.createPrescription(req, res)
        },
    );//valid

    router.get('/prescriptions/:id',
        // isAuth,
        [
            param('id').isMongoId().withMessage('prescription id is required'),
        ],
        (req, res) => PrescriptionController.getPrescription(req, res)
    );

    router.get('/doctor/prescriptions',
        // isAuth,
        // isDoctor,
        (req, res) => PrescriptionController.getDoctorPrescriptions(req, res)
    );

    router.get('/prescriptions/patient/:patientId',
        // isAuth,
        [
            param('patientId').trim().notEmpty().withMessage('patient id is required'),
        ],
        (req, res) => PrescriptionController.getPatientPrescriptions(req, res)
    );

    router.put('/prescriptions/:id/status',
        isAuth,
        iCan(PERMISSIONS.UPDATE_PRESCRIPTION),
        [
            param('id').trim().notEmpty().withMessage('prescription id is required'),
            body('status').trim().notEmpty().withMessage('status is required'),
        ],
        (req, res) => PrescriptionController.updateStatus(req, res)
    );

    router.delete('/prescriptions/:id',
        isAuth,
        iCan(PERMISSIONS.DELETE_PRESCRIPTION),
        [
            param('id').isMongoId().withMessage('invalid prescription id')
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.json({ errors: errors.array() });
            PrescriptionController.deletePrescription(req, res);
        }
    );
}

//
// router.get('/test', RendezvousController.CreerUnRendezvousPourPatient);
module.exports = router;