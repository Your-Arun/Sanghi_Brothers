// const mongoose = require("mongoose");

// const NozzleSchema = new mongoose.Schema({
//   nozzleNumber: { type: String, required: true },
//   member: { type: String, default: "Unassigned" },
//   overtime: { type: Boolean, default: false },
// });

// const ShiftSchema = new mongoose.Schema({
//   date: { type: String, required: true },
//   shiftType: { type: String, enum: ["Morning Shift", "Evening Shift"], required: true },
//   startTime: { type: String, required: true },
//   endTime: { type: String, required: true },
//   supervisor: { type: String, default: "Not Assigned" },
//   airBoy: { type: String, default: "Not Assigned" },
//   extraOperator: { type: String,default: "Not Assigned"  },
//   nozzles: [NozzleSchema], // Array of nozzle objects
// });

// // Middleware to standardize date format before saving
// ShiftSchema.pre("save", function (next) {
//   if (this.date instanceof Date) {
//     this.date = this.date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
//   }
//   next();
// });

// const Shift = mongoose.model("Shift", ShiftSchema);
// module.exports = Shift;

const express = require('express');
const router = express.Router();
const Shift = require('../shifting/Members'); // Path adjust karein apne folder ke hisab se

// 1. SAVE MAP IMAGE
router.post('/save-map', async (req, res) => {
  try {
    const { date, shift, image } = req.body;

    // Find existing shift or create new one
    // Upsert logic: Update if exists, Insert if not
    const updatedShift = await Shift.findOneAndUpdate(
      { date: date, shiftType: shift },
      { $set: { shiftMapImage: image } },
      { new: true, upsert: true } // upsert: true creates doc if not found
    );

    res.status(200).json({ message: "Map Saved to DB", data: updatedShift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. GET MAP IMAGE (To view it)
router.get('/get-map', async (req, res) => {
  try {
    const { date, shift } = req.query;
    const foundShift = await Shift.findOne({ date: date, shiftType: shift });
    
    if (foundShift && foundShift.shiftMapImage) {
      res.status(200).json({ image: foundShift.shiftMapImage });
    } else {
      res.status(404).json({ message: "No image found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;