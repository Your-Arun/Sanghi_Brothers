const express = require('express');
const router = express.Router();
const staffmngemnt= require('../../models/mastersheet/staff')

router.post("/staffmanagement", async (req, res) => {
    try {
        const datasheet = new staffmngemnt(req.body);
        await datasheet.save();
        res.status(201).send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error saving data", error: error.message });
    }
});
router.get("/staffmanagement", async (req, res) => {
    try {
        const datasheet = await staffmngemnt.find();
        res.send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching data", error: error.message });
    }
});
router.get("/staffmanagement/:id", async (req, res) => {
    try {
        const datasheet = await staffmngemnt.findById(req.params.id);
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
router.delete("/staffmanagement/:id", async (req, res) => {
    try {
        const datasheet = await staffmngemnt.findByIdAndDelete(
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

router.put("/staffmanagement/:id", async (req, res) => {
    try {
        const datasheet = await staffmngemnt.findByIdAndUpdate(
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