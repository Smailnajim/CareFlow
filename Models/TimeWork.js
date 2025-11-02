const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TimeWorkSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    days: [{
        dayName: {
            type: String,
            required: true
        },
        hours: [{
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        }]
    }]
}, {collection: 'timeworks',timestamps: true});

module.exports = mongoose.model('TimeWork', TimeWorkSchema);