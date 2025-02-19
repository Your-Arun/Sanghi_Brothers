const mongoose = require('mongoose');

const meterCloseSchema = new mongoose.Schema({
  date: {
    type: Date,
    
  },
  rate: {
    type: Number,
  },
  points: [
    {
      name: {
        type: String,
      },
      n1: {
        type: Number,
      },
      n2: {
        type: Number,
      },
      n3: {
        type: Number,
      },
      n4: {
        type: Number,
      },
      n5: {
        type: Number,
      },
      n6: {
        type: Number,
      },
    },
  ],
  cashUnknown: {
    type: Number,
  },
  cashMs: {
    type: Number,
  },
  cashSp: {
    type: Number,
  },
  crSalesMs: {
    type: Number,
  },
  u2: {
    type: Number,
  },
  totalCredit: {
    type: Number,
  },
  items1: [
    {
      sno: {
        type: Number,
      },
      name: {
        type: String,
      },
      qnty: {
        type: Number,
      },
      amt: {
        type: Number,
      },
      oilqty: {
        type: Number,
      },
      oilamt: {
        type: Number,
      },
      total: {
        type: Number,
      },
    },
  ],
  totaln1: {
    type: Number,
  },
  totaln2: {
    type: Number,
  },
  totaln3: {
    type: Number,
  },
  totaln4: {
    type: Number,
  },
  totaln5: {
    type: Number,
  },
  totaln6: {
    type: Number,
  },
  totals1: {
    type: Number,
  },
  totals2: {
    type: Number,
  },
  totals3: {
    type: Number,
  },
  totals4: {
    type: Number,
  },
  totals5: {
    type: Number,
  },
  totals6: {
    type: Number,
  },
  closingMetern1: {
    type: Number,
  },
  closingMetern2: {
    type: Number,
  },
  closingMetern3: {
    type: Number,
  },
  closingMetern4: {
    type: Number,
  },
  closingMetern5: {
    type: Number,
  },
  closingMetern6: {
    type: Number,
  },
});

const MeterClose = mongoose.model('MeterClose', meterCloseSchema);

module.exports = MeterClose;