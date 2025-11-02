const PrescriptionService = require('../Services/PrescriptionService');


exports.createPrescription = async(req, res) => {
    try {
        const prescriptionData = req.body;
        prescriptionData.doctorId = '68f69d88468f0346b3bc8d08';
        // prescriptionData.doctorId = req.user._id;
        
        const prescription = await PrescriptionService.createPrescription(prescriptionData);
        
        res.json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

exports.getPrescription = async(req, res) => {
    try {
        const { id } = req.params;
        const prescription = await PrescriptionService.getPrescription(id);

        if (!prescription) {
            return res.json({
                success: false,
                message: 'Prescription not found'
            });
        }

        res.json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

exports.getPatientPrescriptions = async(req, res) => {
    try {
        const { patientId } = req.params;
        const prescriptions = await PrescriptionService.getPatientPrescriptions(patientId);

        res.json({
            success: true,
            data: prescriptions
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

exports.getDoctorPrescriptions = async(req, res) => {
    try {
        const doctorId = "68f69d88468f0346b3bc8d08";
        // const doctorId = req.user._id;
        const prescriptions = await PrescriptionService.getDoctorPrescriptions(doctorId);

        res.json({
            success: true,
            data: prescriptions
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

exports.updateStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const prescription = await PrescriptionService.updatePrescriptionStatus(id, status);

        res.json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

exports.deletePrescription = async(req, res) => {
    try {
        const { id } = req.params;
        const prescription = await PrescriptionService.deletePrescription(id);
        
        if (!prescription) {
            return res.json({
                success: false,
                message: 'Prescription not found'
            });
        }

        res.json({
            success: true,
            message: 'Prescription deleted successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}
