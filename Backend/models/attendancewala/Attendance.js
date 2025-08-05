const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave", "Holiday", "WFH"],
    default: "Present",
  },
  checkIn: String,
  checkOut: String,
});

module.exports = mongoose.model("Attendance", attendanceSchema);
