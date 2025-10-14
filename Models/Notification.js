const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    rendezVousId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    what: {type: String, required: true},
    when: {type: Date, required: true}
}, {collection: 'notifications', timestamps: true});

module.exports = mongoose.model('Notification', NotificationSchema);