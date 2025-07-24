const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: String }, // e.g. "2025-07-24"
    checkIn: String,
    checkOut: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);