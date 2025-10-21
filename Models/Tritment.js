const {Schema, Types, model} = require('mongoose');

const tritmentSchema = new Schema({
    rendezvousId: {type: Types.ObjectId, required: true},
    description: String
}, {collection: 'tritments', timestamps: true, strict: false});

tritmentSchema.post('save', async function(doc) {
    const RendezvousRepository = require('./../Repositories/RendezvousRepository');
    const rendezvous = await RendezvousRepository.getRendezvousById(doc.rendezvousId);
    if (rendezvous) {
        rendezvous.status = 'complete';
        await rendezvous.save();
    }
});
module.exports = model('Tritment', tritmentSchema);