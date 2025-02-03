const mongoose = require('mongoose');
const TankLorryManagementSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    points: [
        {
            point: {
                type: String,
            },
            itemToCheck: {
                type: String,
            },
            ok: {
                type: String,

            },
            responsible: {
                type: String,
            },
            defectPerson: {
                type: String,
            },
            defectDelaysDays: {
                type: String,
            },
            deadline: {
                type: String,
            },
            comment: {
                type: String,
            },
        },
    ],
});

const LubricantManagement = mongoose.model('Tank_Lorry_Management', TankLorryManagementSchema);

module.exports = LubricantManagement;  