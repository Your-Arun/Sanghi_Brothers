import mongoose from "mongoose";

const rowSchema = new mongoose.Schema({
  name: String,
  sale: Number,
  paytm: Number,
});

const salePaytmSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  shift: { type: String, enum: ["Morning", "Evening"], required: true },
  rows: [rowSchema],

  // ✅ Add these fields
  totalSale: { type: Number, default: 0 },
  totalPaytm: { type: Number, default: 0 },
});

export default mongoose.model("SalePaytm", salePaytmSchema);
