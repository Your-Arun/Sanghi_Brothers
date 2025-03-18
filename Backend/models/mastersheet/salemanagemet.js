const mongoose = require('mongoose');

const salesManagementSheetSchema = new mongoose.Schema({
    dat2: {
        type: String,
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
        },
    ],
});

const SalesManagementSheet = mongoose.model('SalesManagementSheet', salesManagementSheetSchema);

module.exports = SalesManagementSheet;