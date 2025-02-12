const mongoose = require("mongoose");

const shiftHistorySchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  name: { type: String, required: true },
  shift: { type: String, required: true },
  assignedCount: { type: Number, default: 1 },
  date: { type: String, required: true }, // 📅 Shift ka date track hoga
});

module.exports = mongoose.model("ShiftHistory", shiftHistorySchema);
