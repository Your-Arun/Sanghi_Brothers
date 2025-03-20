const express = require("express");
const router = express.Router();
const Shift = require('./shifts')


router.post("/save", async (req, res) => {
    try {
      await Shift.deleteMany({ date: req.body.date }); // Remove old shifts for the date
      await Shift.insertMany(req.body.shifts); // Save new shifts
      res.json({ message: "Shifts saved successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error saving shifts" });
    }
  });


  // Fetch shifts
router.get("/:date", async (req, res) => {
    try {
      const shifts = await Shift.find({ date: req.params.date });
      res.json(shifts);
    } catch (error) {
      res.status(500).json({ error: "Error fetching shifts" });
    }
  });
  

module.exports = router;