const Rendezvous = require('./../Models/RendezVous');

exports.createRendezvou = async (data) => {
    try {
        
        return await Rendezvous.create({
            medecinId: data.medecinId,
            patientId: data.patientId,
            status: 'created',
            dateStar: data.dateStar,
            dateFine: data.dateFine,
            cause: data.cause
        });
    } catch (error) {
        console.log('eee', error);
    }
}