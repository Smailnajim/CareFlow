const Tritment = require('../models/tritment');

exports.createATritment = async (data) => {
    return await Tritment.create(data);
}

exports.getTritmentById = async (id) => {
    return await Tritment.findById(id);
}

exports.updateTritment = async (id, data) => {
    return await Tritment.findByIdAndUpdate(id, data, { new: true });
}

exports.deleteTritment = async (id) => {
    return await Tritment.findByIdAndDelete(id);
}