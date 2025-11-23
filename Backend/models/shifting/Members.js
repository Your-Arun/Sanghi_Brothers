// const mongoose = require("mongoose");
// const memberSchema = new mongoose.Schema({
//   name: String,
//   role: String,
//   shift: String,
//   available: String,
// });
// const Member = mongoose.model("Member", memberSchema);
// module.exports = Member;



const mongoose = require("mongoose");

const NozzleSchema = new mongoose.Schema({
  nozzleNumber: { type: String, required: true },
  member: { type: String, default: "Unassigned" },
  overtime: { type: Boolean, default: false },
});

const ShiftSchema = new mongoose.Schema({
  date: { type: String, required: true },
  shiftType: { type: String, enum: ["Morning", "Evening"], required: true }, // Changed enum to match frontend values
  startTime: { type: String, default: "" }, // Made optional/default for easier saving
  endTime: { type: String, default: "" },
  supervisor: { type: String, default: "Not Assigned" },
  airBoy: { type: String, default: "Not Assigned" },
  extraOperator: { type: String, default: "Not Assigned" },
  
  // --- NEW FIELD FOR IMAGE ---
  shiftMapImage: { type: String, default: "" }, // Stores Base64 string
  
  nozzles: [NozzleSchema],
});

// Middleware to standardize date
ShiftSchema.pre("save", function (next) {
  if (this.date instanceof Date) {
    this.date = this.date.toISOString().split("T")[0];
  }
  next();
});

const Shift = mongoose.model("Shift", ShiftSchema);
module.exports = Shift;