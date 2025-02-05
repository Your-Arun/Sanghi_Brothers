const express = require('express');
const router = express.Router();
const Lekha= require('../models/lekha')


router.post("", async (req, res) => {
    try {
        const datasheet = new Lekha(req.body);
        await datasheet.save();
        res.status(201).send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error saving data", error: error.message });
    }
});
router.get("", async (req, res) => {
    try {
        const datasheet = await Lekha.find();
        res.send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching data", error: error.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const datasheet = await Lekha.findById(req.params.id);
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
router.delete("/:id", async (req, res) => {
    try {
        const datasheet = await Lekha.findByIdAndDelete(
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

router.put("/:id", async (req, res) => {
    try {
        const datasheet = await Lekha.findByIdAndUpdate(
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