const express = require('express');
const router = express.Router();
const MeterClose = require('../models/meterclose');
// Create a new MeterClose document
router.post('/meterclose', async (req, res) => {
    try {
        const meterClose = new MeterClose(req.body);
        await meterClose.save();
        res.status(201).send(meterClose);
    } catch (err) {
        res.status(400).send(err);
    }
});
// Get all MeterClose documents
router.get('/meterclose', async (req, res) => {
    try {
        const meterClose = await MeterClose.find();
        res.send(meterClose);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a single MeterClose document by ID
router.get('/meterclose/:id', async (req, res) => {
    try {
        const meterClose = await MeterClose.findById(req.params.id);
        if (!meterClose) {
            return res.status(404).send();
        }
        res.send(meterClose);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a MeterClose document
router.patch('/meterclose/:id', async (req, res) => {
    try {
        const meterClose = await MeterClose.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!meterClose) {
            return res.status(404).send();
        }
        res.send(meterClose);
    } catch (err) {
        res.status(500).send(err);
    }
});


router.put('/meterclose/:id', async (req, res) => {
    try {
        const datasheet = await MeterClose.findByIdAndUpdate(
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

// Delete a MeterClose document
router.delete('/meterclose/:id', async (req, res) => {
    try {
        const meterClose = await MeterClose.findByIdAndDelete(req.params.id);
        if (!meterClose) {
            return res.status(404).send();
        }
        res.send(meterClose);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;