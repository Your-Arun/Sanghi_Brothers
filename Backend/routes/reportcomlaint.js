const express= require('express');
const router = express.Router();
const Reports=require('../models/report')
// Create a Report
router.post("/report", async (req, res) => {
    const { title, department, content } = req.body;
  
    if (!title || !department || !content) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    try {
      const newReport = new Reports({
        title,
        department,
        content,
      });
  
      await newReport.save();
      res.status(201).json({ message: "Report saved successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save the report." });
    }
  });
  // Fetch Reports for a Department
  router.get("/reports", async (req, res) => {
    try {
      const reportss = await Reports.find({});
      res.json(reportss);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });
  // complaint ke lie h
  router.put("/reports/:id", async (req, res) => {
    try {
      const { title, content } = req.body; // assuming you're updating the content
      const reportId = req.params.id;
  
      // Update the report in the database (example with MongoDB)
      const updatedReport = await Reports.findByIdAndUpdate(
        reportId,
        { title, content }, // Assuming you're only updating the content
        { new: true } // Return the updated report
      );
  
      if (!updatedReport) {
        return res.status(404).json({ error: "Report not found" });
      }
  
      res.status(200).json(updatedReport);
    } catch (err) {
      console.error("Error updating report:", err);
      res.status(500).json({ error: "Failed to update report" });
    }
  });
  router.delete('/reports/:id', async (req, res) => {
    try {
      const reportId = req.params.id;
      const report = await Reports.findByIdAndDelete(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.status(200).json(report);
    } catch (e) {
      console.error("Error deleting report:", e);
      res.status(500).json({ message: "Server error" });
    }
  }
  );
  module.exports= router;