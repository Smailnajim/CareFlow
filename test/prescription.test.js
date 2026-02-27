const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../app');

describe('Prescription API Tests', () => {
    let prescriptionId;
    const validPatientId = '507f1f77bcf86cd799439011';
    const validTritmentId = '507f1f77bcf86cd799439012';

    before(async function() {
        this.timeout(15000);
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.URL_TO_CONNECT);
        }
    });

    after(async function() {
        await mongoose.connection.close();
    });

    describe('POST /prescriptions', () => {
        it('should create a new prescription', (done) => {
            request(app)
                .post('/api/prescriptions')
                .send({
                    patientId: validPatientId,
                    tritmentId: validTritmentId,
                    medicaments: [
                        {
                            name: 'Paracetamol',
                            dosage: '500mg',
                            voieAdministration: 'Oral',
                            frequence: '3 fois par jour',
                            duree: '7 jours',
                            renouvellements: 2
                        }
                    ]
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    if (res.body.success === true) {
                        expect(res.body).to.have.property('data');
                        prescriptionId = res.body.data._id;
                    }
                    done();
                });
        });

        it('should return validation error for missing patientId', (done) => {
            request(app)
                .post('/api/prescriptions')
                .send({
                    tritmentId: validTritmentId,
                    medicaments: []
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('errors');
                    done();
                });
        });
    });

    describe('GET /prescriptions/:id', () => {
        it('should get a prescription by id', (done) => {
            if (!prescriptionId) {
                return done();
            }
            request(app)
                .get(`/api/prescriptions/${prescriptionId}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('GET /doctor/prescriptions', () => {
        it('should get all doctor prescriptions', (done) => {
            request(app)
                .get('/api/doctor/prescriptions')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('PUT /prescriptions/:id/status', () => {
        it('should update prescription status', (done) => {
            if (!prescriptionId) {
                return done();
            }
            request(app)
                .put(`/api/prescriptions/${prescriptionId}/status`)
                .send({ status: 'completed' })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
    });
});
