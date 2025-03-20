const mongoose = require("mongoose");

const NozzleSchema = new mongoose.Schema({
  nozzleNumber: { type: String}, // Example: "Nozzle 1"
  member: { type: String }, // Assigned Member Name
  overtime: { type: Boolean } // Overtime status
});

const ShiftSchema = new mongoose.Schema({
  date: { type: String, required: true }, // "21/03/2025"
  shiftType: { type: String, enum: ["Morning Shift", "Evening Shift"], required: true },
  startTime: { type: String, required: true }, // "06:00"
  endTime: { type: String, required: true }, // "14:30"
  supervisor: { type: String },
  airBoy: { type: String },
  nozzles: [NozzleSchema] // Array of nozzle assignments
});

const Shift = mongoose.model("Shift", ShiftSchema);

module.exports = Shift;
