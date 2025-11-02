const PrescriptionRepository = require('../Repositories/PrescriptionRepository');
const Logger = require('../Utils/Logger');




    exports.createPrescription = async(data) => {
        try {
            const prescription = await PrescriptionRepository.create(data);
            Logger.info(`New prescription created by doctor ${data.doctorId}`);
            return prescription;
        } catch (error) {
            Logger.error(`Error creating prescription: ${error.message}`);
            throw error;
        }
    }

    exports.getPrescription = async(id) => {
        try {
            return await PrescriptionRepository.getById(id);
        } catch (error) {
            Logger.error(`Error getting prescription: ${error.message}`);
            throw error;
        }
    }

    exports.getPatientPrescriptions = async(patientId, authUser) => {
        try {
            const RoleService = require('./RoleService');
            const role = await RoleService.getRoleById(authUser.roleId);
            
            if (role.name == 'patient' && authUser._id != patientId) {
                throw new Error('Patients can only view their prescriptions');
            }
            return await PrescriptionRepository.getByPatient(patientId);
        } catch (error) {
            Logger.error(`Error getting patient prescriptions: ${error.message}`);
            throw error;
        }
    }

    exports.getDoctorPrescriptions = async(doctorId) => {
        try {
            return await PrescriptionRepository.getByDoctor(doctorId);
        } catch (error) {
            Logger.error(`Error getting doctor prescriptions: ${error.message}`);
            throw error;
        }
    }

    exports.updatePrescriptionStatus = async(id, status) => {
        try {
            return await PrescriptionRepository.updateStatus(id, status);
        } catch (error) {
            Logger.error(`Error updating prescription status: ${error.message}`);
            throw error;
        }
    }

    exports.deletePrescription = async(id) => {
        try {
            const prescription = await PrescriptionRepository.deleteById(id);
            if (!prescription) throw new Error('Prescription not found');
            Logger.info(`Prescription ${id} deleted`);
            return prescription;
        } catch (error) {
            Logger.error(`Error deleting prescription: ${error.message}`);
            throw error;
        }
    }

