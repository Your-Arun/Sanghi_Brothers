const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// ✅ Deposit Schema & Model
const depositSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    bank: { type: String, required: true },
    date: { type: Date, default: Date.now },
    totalamount: { type: Number, default: 0 },
});

const Deposit = mongoose.model("Deposit", depositSchema);

// ✅ Add Deposit (POST)
router.post("/cashier",  async (req, res) => {
    const { amount, bank } = req.body;

    // Check if it's Saturday or Sunday
    const today = new Date();
    const day = today.getDay();
    if (day === 0 || day === 6) {
        return res.status(400).json({ message: "❌ Bank is closed on Saturday & Sunday" });
    }

    if (!amount || !bank) {
        return res.status(400).json({ message: "❌ Amount & Bank are required" });
    }

    try {
        const newDeposit = new Deposit({ amount, bank });
        await newDeposit.save();
        res.status(201).json({ message: "✅ Deposit Added Successfully" });
    } catch (error) {
        res.status(500).json({ message: "❌ Error saving deposit" });
    }
});

// ✅ Get All Deposits (GET)
router.get("/cashier",  async (req, res) => {
    try {
        const deposits = await Deposit.find().sort({ date: -1 });
        res.status(200).json(deposits);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching deposits" });
    }
});

// ✅ Get Total Deposited Amount (GET)
router.get("/cashier", async (req, res) => {
    try {
        const total = await Deposit.aggregate([{ $group: { _id: null, totalAmount: { $sum: "$amount" } } }]);
        res.status(200).json({ totalAmount: total[0]?.totalAmount || 0 });
    } catch (error) {
        res.status(500).json({ message: "❌ Error calculating total" });
    }
});

module.exports = router;
