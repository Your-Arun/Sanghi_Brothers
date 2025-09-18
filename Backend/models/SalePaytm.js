const mongoose = require("mongoose");

const salePaytmSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  rows: [
    {
      sale: { type: Number, default: 0 },
      paytm: { type: Number, default: 0 },
    },
  ],
  totalSale: { type: Number, default: 0 },
  totalPaytm: { type: Number, default: 0 },
});

module.exports = mongoose.model("SalePaytm", salePaytmSchema);
