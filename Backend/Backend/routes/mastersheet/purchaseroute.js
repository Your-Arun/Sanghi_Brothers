const express = require('express');
const router = express.Router();
const PurchaseMngment= require('../../models/mastersheet/purchasemngment')

router.post("/purchasemanagement", async (req, res) => {
    try {
        const datasheet = new PurchaseMngment(req.body);
        await datasheet.save();
        res.status(201).send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error saving data", error: error.message });
    }
});
router.get("/purchasemanagement", async (req, res) => {
    try {
        const datasheet = await PurchaseMngment.find();
        res.send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching data", error: error.message });
    }
});
router.get("/purchasemanagement/:id", async (req, res) => {
    try {
        const datasheet = await PurchaseMngment.findById(req.params.id);
        if (!datasheet) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching data", error: error.message });
    }
});
router.delete("/purchasemanagement/:id", async (req, res) => {
    try {
        const datasheet = await PurchaseMngment.findByIdAndDelete(
            req.params.id
        );
        if (!datasheet) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error deleting data", error: error.message });
    }
});

router.put("/purchasemanagement/:id", async (req, res) => {
    try {
        const datasheet = await PurchaseMngment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!datasheet) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error updating data", error: error.message });
    }
});


module.exports = router;   