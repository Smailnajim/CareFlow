const mongoose = require('mongoose');

const PharmacieSchema = new mongoose.Schema({
    nom: {type: String, required: true},
    coordonnees:[{
        adresse: {type: String, required: true},
        ville: {type: String, required: true},
        codePostal: {type: String, required: true},
        pays: {type: String, required: true},
        telephone: {type: String, required: true},
        email: {type: String, required: true}
    }],
    identifiants:[{
        firstName:String,
        lastName:String
    }]
}, {collection: 'pharmacies', timestamps: true});