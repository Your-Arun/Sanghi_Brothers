const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String, // e.g., '2025-07-23'
  checkIn: String,
  checkOut: String,
  status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
