const mongoose = require('mongoose');

const Staff = new mongoose.Schema({
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

const Stafff = mongoose.model('Staff Management', Staff);



module.exports = Stafff;