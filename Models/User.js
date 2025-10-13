const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schem = new mongoose.Schema({
    roleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true},
    image: {type: String},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String},
    password: {type: String, required: true},
    status: {
        type: String,
        enum: ['active', 'suspended'],
        required: true
    },
    dateNasonse: {type: Date},
    refreshTokens: [String]
},{collection: 'users', timestamps: true });

Schem.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

Schem.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", Schem);