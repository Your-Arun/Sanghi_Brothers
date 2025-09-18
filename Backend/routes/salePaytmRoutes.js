const express = require("express");
const router = express.Router();
const SalePaytm = require("../models/SalePaytm");

// Create new entry
router.post("/salepaytm", async (req, res) => {
  try {
    const { date, shift, rows } = req.body;

    const totalSale = rows.reduce((sum, r) => sum + (parseFloat(r.sale) || 0), 0);
    const totalPaytm = rows.reduce((sum, r) => sum + (parseFloat(r.paytm) || 0), 0);

    const newEntry = new SalePaytm({ date, shift, rows, totalSale, totalPaytm });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/salepaytm", async (req, res) => {
    try {
      const { date } = req.query;
      let filter = {};
  
      if (date) {
        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
        }
  
        const start = new Date(parsed);
        start.setHours(0, 0, 0, 0);
  
        const end = new Date(parsed);
        end.setHours(23, 59, 59, 999);
  
        filter.date = { $gte: start, $lte: end };
      }
  
      const entries = await SalePaytm.find(filter).sort({ date: -1 });
      res.json(entries);
    } catch (err) {
      console.error("Error in /salepaytm:", err); // log for debugging
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  });
  

// Update entry
router.put("/salepaytm/:id", async (req, res) => {
  try {
    const { date, shift, rows } = req.body;

    const totalSale = rows.reduce((sum, r) => sum + (parseFloat(r.sale) || 0), 0);
    const totalPaytm = rows.reduce((sum, r) => sum + (parseFloat(r.paytm) || 0), 0);

    const updated = await SalePaytm.findByIdAndUpdate(
      req.params.id,
      { date, shift, rows, totalSale, totalPaytm },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete entry
router.delete("/salepaytm/:id", async (req, res) => {
  try {
    await SalePaytm.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
