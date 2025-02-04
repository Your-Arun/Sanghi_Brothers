const express = require('express');
const router = express.Router();
const  LubricantManagement = require('../../models/mastersheet/labricant')


//lubricant 
router.post("/lubricantmanagement", async (req, res) => {
    try {
        const datasheet = new LubricantManagement(req.body);
        await datasheet.save();
        res.status(201).send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error saving data", error: error.message });
    }
});
router.get("/lubricantmanagement", async (req, res) => {
    try {
        const datasheet = await LubricantManagement.find();
        res.send(datasheet);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching data", error: error.message });
    }
});
router.get("/lubricantmanagement/:id", async (req, res) => {
    try {
        const datasheet = await LubricantManagement.findById(req.params.id);
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
router.delete("/lubricantmanagement/:id", async (req, res) => {
    try {
        const datasheet = await LubricantManagement.findByIdAndDelete(
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

router.put("/lubricantmanagement/:id", async (req, res) => {
    try {
        const datasheet = await LubricantManagement.findByIdAndUpdate(
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