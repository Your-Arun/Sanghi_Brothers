// models/Shift.js
const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Morning Shift", "Evening Shift"], // Only allow specific shifts
  },
  startTime: {
    required: true,
  },
  endTime: {
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Reference to the Member model
    },
  ],
  nozzles: {
    type: [String],
    default: ["Nozzle 1", "Nozzle 2", "Nozzle 3", "Nozzle 4", "Nozzle 5", "Nozzle 6"],
  },
});

const Shift = mongoose.model("Shift", shiftSchema);

module.exports = Shift;