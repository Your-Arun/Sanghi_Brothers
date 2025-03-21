const express = require("express");
const router = express.Router();
const Shift = require("./shifts"); // Ensure the correct path

// Save shifts
router.post("/shiftingsavee", async (req, res) => {
  try {
    const shiftData = req.body;

    // Ensure shiftData is an array
    if (!Array.isArray(shiftData)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Extract date (assuming all shifts have the same date)
    const shiftDate = shiftData[0]?.date;
    if (!shiftDate) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Remove old shifts for the same date before inserting new ones
    await Shift.deleteMany({ date: shiftDate });

    // Ensure overtime members are included
    const formattedShifts = shiftData.map(shift => ({
      ...shift,
      overtimeMembers: shift.overtimeMembers || [] // Ensure empty array if missing
    }));

    // Insert new shifts with proper structure
    await Shift.insertMany(formattedShifts);

    res.json({ message: "Shift data saved successfully" });
  } catch (error) {
    console.error("Error saving shift data:", error);
    res.status(500).json({ message: "Error saving shift data" });
  }
});

// Fetch shifts by date
router.get("/:date", async (req, res) => {
  try {
    const shifts = await Shift.find({ date: req.params.date }).lean(); // Convert to plain JS object
    res.json(shifts);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    res.status(500).json({ message: "Error fetching shifts" });
  }
});

module.exports = router;
