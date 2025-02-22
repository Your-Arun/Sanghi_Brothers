const mongoose = require("mongoose");

const cashSlipSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    shift: { type: String, required: true },
    name: { type: String, required: true },
    nozzleNo: { type: String, required: true },
    openingReading: { type: Number, required: true },
    closingReading: { type: Number, required: true },
    salesInLtr: { type: Number, required: true },
    testing: { type: Number, required: true },
    pending: { type: Number, required: true },
    cashDetails: { type: Object, required: true },
    uFill: { type: Number, required: true },
    iciciSlip: { type: Number, required: true },
    sbiSlip: { type: Number, required: true },
    paytm: { type: Number, required: true },
    expenses: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const CashSlip = mongoose.model("CashSlip", cashSlipSchema);
module.exports = CashSlip;
