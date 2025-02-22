const express = require('express');
const router = express.Router();
const CashSlip = require('../models/cashslipmodal');



router.post("/Cashslip", async (req, res) => {
    try {
        const newSlip = new CashSlip(req.body);
        await newSlip.save();
        res.status(201).json({ message: "✅ Cash slip saved successfully!", data: newSlip });
    } catch (error) {
        console.error("❌ Error Saving Cash Slip:", error);
        res.status(400).json({ message: "❌ Failed to save cash slip!", error: error.message });
    }
});

// ➤ Get All Cash Slips
router.get("/Cashslip", async (req, res) => {
    try {
        const slips = await CashSlip.find();
        res.status(200).json(slips);
    } catch (error) {
        console.error("❌ Error Fetching Cash Slips:", error);
        res.status(500).json({ message: "❌ Failed to fetch cash slips!", error: error.message });
    }
});

router.get("/Cashslip/:id", async (req, res) => {
    try {
        const slip = await CashSlip.findById(req.params.id);
        if (!slip) {
            return res.status(404).json({ message: "�� Cash slip not found!" });
        }
        res.status(200).json(slip);
    } catch (error) {
        console.error("�� Error Fetching Cash Slip:", error);
        res.status(500).json({ message: "�� Failed to fetch cash slip!", error: error.message });
    }
});

router.put("/Cashslip/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedSlip = await CashSlip.findByIdAndUpdate(id, req.body, {
            new: tru
        });
        if (!updatedSlip) {
            return res.status(404).json({ message: "❌ Cash slip not found!" });
        }
        res.status(200).json({ message: "�� Cash slip updated successfully!", data: updatedSlip });
    } catch (error) {
        console.error("�� Error Updating Cash Slip:", error);
        res.status(400).json({ message: "�� Failed to update cash slip!", error: error.message });
    }
});

module.exports = router;   