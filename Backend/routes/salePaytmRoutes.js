const express = require("express");
const router = express.Router();
const SalePaytm = require("../models/SalePaytm");

// Create new entry
router.post("/salepaytm", async (req, res) => {
  try {
    const { date, shift, rows } = req.body;

    if (!date || !shift || !rows) {
      return res.status(400).json({ message: "Date, shift and rows are required" });
    }

    const totalSale = rows.reduce((sum, r) => sum + (parseFloat(r.sale) || 0), 0);
    const totalPaytm = rows.reduce((sum, r) => sum + (parseFloat(r.paytm) || 0), 0);

    const newEntry = new SalePaytm({ date, shift, rows, totalSale, totalPaytm });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Error in POST /salepaytm:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
