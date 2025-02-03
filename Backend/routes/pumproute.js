const express = require("express");
const PumpReport = require("../models/pumpreport");

const router = express.Router();

router.post("/pumpsheet", async (req, res) => {
  try {
    const datasheet = new PumpReport(req.body);
    await datasheet.save();
    res.status(201).send(datasheet);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error saving data", error: error.message });
  }
});

router.get("/pumpsheet", async (req, res) => {
  try {
    const datasheet = await PumpReport.find();
    res.status(200).send(datasheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.get("/pumpsheet/:id", async (req, res) => {
  try {
    const datasheet = await PumpReport.findById(req.params.id);
    if (!datasheet) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.status(200).send(datasheet);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
});
router.delete("/pumpsheet/:id", async (req, res) => {
  try {
    const datasheet = await PumpReport.findByIdAndDelete(req.params.id);
    if (!datasheet) {
      res.status(404).send();
    } else {
      res.status(200).send(datasheet);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/pumpsheet/:id", async (req, res) => {
  try {
    const datasheet = await PumpReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!datasheet) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.status(200).send(datasheet);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating data" });
  }
});
module.exports = router;
