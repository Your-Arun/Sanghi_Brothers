const mongoose = require('mongoose');

const lekha = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
  },
  sale: {
    type: Number,
  },
  paytm: {
    type: Number,
  },
  shift: {
    type: String,
  },
  nozzleReadings: [
    {
      reading: {
        type: Number,
      },
      testing: {
        type: Number,
      },
      pending: {
        type: String,
      },
    },
  ],
  points: [
    {
        sno: {


        type: String,
      },
      name: {
        type: String,
      },
      opening: {
        type: String,
        
      },
      sale: {
        type: String,
      },
      leakage: {
        type: String,
      },
      add: {
        type: String,
      },
      closing: {
        type: String,
      },
    },
  ],
});

const jokha= mongoose.model('Lekha_Jokha', lekha);



module.exports = jokha;