import mongoose from "mongoose";

const rowSchema = new mongoose.Schema({
  name: String,
  sale: Number,
  paytm: Number,
});

const salePaytmSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  rows: [rowSchema],
});

export default mongoose.model("SalePaytm", salePaytmSchema);
