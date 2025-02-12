const express = require("express");
const ShiftHistory = require("./ShiftHistory");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) return res.status(400).json({ error: "Date is required" });

    const history = await ShiftHistory.find({ date });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
