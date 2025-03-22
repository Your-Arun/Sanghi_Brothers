const express = require("express");
const router = express.Router();
const Shift = require("./shifts");

// Save Shift Data API
router.post("/shiftingsavee", async (req, res) => {
    try {
        const shiftsData = req.body; // Array of shifts

        if (!Array.isArray(shiftsData) || shiftsData.length === 0) {
            return res.status(400).json({ error: "Invalid shift data" });
        }

        // Save all shift data in the database
        const savedShifts = await Shift.insertMany(shiftsData);

        res.status(201).json({ message: "Shifts saved successfully", shifts: savedShifts });
    } catch (error) {
        console.error("Error saving shifts:", error);
        res.status(500).json({ error: "Failed to save shift data" });
    }
});

router.get('/shiftingsave', async (req, res) => {
    try {
        const shifts = await Shift.find();
        res.json(shifts);
    } catch (error) {
        console.error("Error fetching shifts:", error);
        res.status(500).json({ error: "Failed to fetch shift data" });
    }

})

// Get shift data by date
// 📌 GET API to fetch shifts by date
router.get("/getshifts", async (req, res) => {
    try {
      const { date } = req.query; // Date from frontend (YYYY-MM-DD)
      
      if (!date) {
        return res.status(400).json({ error: "Date is required" });
      }
  
      // Convert any non-ISO date to YYYY-MM-DD
      const formattedDate = new Date(date).toISOString().split("T")[0];
  
      // Fetch shifts where date matches exactly
      const shifts = await Shift.find({ date: formattedDate });
  
      res.status(200).json(shifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  



module.exports = router;
