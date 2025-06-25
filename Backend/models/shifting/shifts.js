const mongoose = require("mongoose");

const NozzleSchema = new mongoose.Schema({
  nozzleNumber: { type: String, required: true },
  member: { type: String, default: "Unassigned" },
  overtime: { type: Boolean, default: false },
});

const ShiftSchema = new mongoose.Schema({
  date: { type: String, required: true },
  shiftType: { type: String, enum: ["Morning Shift", "Evening Shift"], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  supervisor: { type: String, default: "Not Assigned" },
  airBoy: { type: String, default: "Not Assigned" },
  extraOperator: { type: String,default: "Not Assigned"  },
  nozzles: [NozzleSchema], // Array of nozzle objects
});

// Middleware to standardize date format before saving
ShiftSchema.pre("save", function (next) {
  if (this.date instanceof Date) {
    this.date = this.date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  }
  next();
});

const Shift = mongoose.model("Shift", ShiftSchema);
module.exports = Shift;
