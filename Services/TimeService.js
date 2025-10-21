const RendezvousRepository = require('./../Repositories/RendezvousRepository');


exports.checkRendezTime = async (dateStar, dateFine) => {
    const therisRendez = await RendezvousRepository.checkDateDisponible(dateStar, dateFine);
    if (therisRendez) throw new Error(`you can't take this period ${dateStar} -> ${dateFine} becouse ther is a rendez at: ${therisRendez.dateStar} -> ${therisRendez.dateFine}`);
    return;
}