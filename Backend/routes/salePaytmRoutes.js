const express = require("express");
const router = express.Router();
const SalePaytm = require("../models/SalePaytm");

// Create new entry
router.post("/salepaytm", async (req, res) => {
  try {
    const { name, date, rows } = req.body;
    const totalSale = rows.reduce((sum, r) => sum + (r.sale || 0), 0);
    const totalPaytm = rows.reduce((sum, r) => sum + (r.paytm || 0), 0);

    const newEntry = new SalePaytm({ name, date, rows, totalSale, totalPaytm });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all entries (with optional date filter)
router.get("/salepaytm", async (req, res) => {
  try {
    const { date } = req.query;
    let filter = {};
    if (date) filter.date = new Date(date);

    const entries = await SalePaytm.find(filter).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update entry
router.put("/salepaytm/:id", async (req, res) => {
  try {
    const { name, date, rows } = req.body;
    const totalSale = rows.reduce((sum, r) => sum + (r.sale || 0), 0);
    const totalPaytm = rows.reduce((sum, r) => sum + (r.paytm || 0), 0);

    const updated = await SalePaytm.findByIdAndUpdate(
      req.params.id,
      { name, date, rows, totalSale, totalPaytm },
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
