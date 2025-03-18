const mongoose = require('mongoose');
const LubricantManagementSchema = new mongoose.Schema({
    dat2: {
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

const LubricantManagement = mongoose.model('LubricantManagement', LubricantManagementSchema);

module.exports = LubricantManagement;  