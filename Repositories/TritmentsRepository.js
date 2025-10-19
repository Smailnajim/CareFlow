const Tritment = require('../models/tritment');

exports.createATritment = async (data) => {
    try {
        return await Tritment.create(data);
    } catch (error) {
        throw error;
    }
}