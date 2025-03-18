const mongoose = require('mongoose');

const fin = new mongoose.Schema({
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

const Fiinn = mongoose.model('Finance Management', fin);



module.exports = Fiinn;