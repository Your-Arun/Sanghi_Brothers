const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  date: { type: String, required: true },
  shiftType: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  supervisor: { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    name: { type: String } 
  },
  airBoy: { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    name: { type: String } 
  },
  nozzles: [
    {
      nozzleNumber: { type: String },
      member: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String }
      },
      overtime: { type: Boolean }
    }
  ],
  overtimeMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // 🔥 Added Overtime Members
});

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
