const mongoose = require('mongoose');

const PurchaseManagementSchema = new mongoose.Schema({
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

const PurchaseManagement = mongoose.model('PurchaseManagement', PurchaseManagementSchema);



module.exports = PurchaseManagement;