const Tritment = require('../models/tritment');

exports.createATritment = async (data) => {
    return await Tritment.create(data);
}