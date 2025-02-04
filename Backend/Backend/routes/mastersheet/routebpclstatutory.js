const express = require('express');
const router = express.Router();
const bpclstatutory= require('../../models/mastersheet/bpclstatutory')

router.post("/bpcl&statutory", async (req, res) => {
    try {
        const datasheet = new bpclstatutory(req.body);
        await datasheet.save();
        res.status(201).send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error saving data", error: error.message });
    }
});
router.get("/bpcl&statutory", async (req, res) => {
    try {
        const datasheet = await bpclstatutory.find();
        res.send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching data", error: error.message });
    }
});
router.get("/bpcl&statutory/:id", async (req, res) => {
    try {
        const datasheet = await bpclstatutory.findById(req.params.id);
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
router.delete("/bpcl&statutory/:id", async (req, res) => {
    try {
        const datasheet = await bpclstatutory.findByIdAndDelete(
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

router.put("/bpcl&statutory/:id", async (req, res) => {
    try {
        const datasheet = await bpclstatutory.findByIdAndUpdate(
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