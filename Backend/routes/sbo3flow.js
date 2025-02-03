const express = require("express");
const SB03Monthly = require("../models/sb03");

const router = express.Router();

// Route to create a new SB03Monthly document
router.post("/monthlyfundflow", async (req, res) => {
  const newData = new SB03Monthly(req.body);

  try {
    const savedData = await newData.save();
    res.status(201).json({ message: "Data saved successfully!", data: savedData });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Failed to save data.", error: error.message });
  }
});
// Route to get all SB03Monthly documents
router.get("/monthlyfundflow", async (req, res) => {
  try {
    const sb03MonthlyDocs = await SB03Monthly.find();
    res.status(200).json(sb03MonthlyDocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// In your routes/sb03Routes.js
router.get("/monthlyfundflow/:id", async (req, res) => {
  try {
    const sb03MonthlyDoc = await SB03Monthly.findById(req.params.id);
    if (!sb03MonthlyDoc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(sb03MonthlyDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update a specific SB03Monthly document by ID
router.put("/monthlyfundflow/:id", async (req, res) => {
  try {
    const updatedSB03Monthly = await SB03Monthly.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSB03Monthly) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(updatedSB03Monthly);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a specific SB03Monthly document by ID
router.delete("/monthlyfundflow/:id", async (req, res) => {
  try {
    const deletedSB03Monthly = await SB03Monthly.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSB03Monthly) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
