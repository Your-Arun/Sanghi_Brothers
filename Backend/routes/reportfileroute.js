const express = require('express');
const router = express.Router();
const ReportFile= require('../models/reportfile')



//reportfile saving
router.post("/reportfile", async (req, res) => {
    try {
      const reportfiles = new ReportFile(req.body);
      await reportfiles.save();
      res.status(201).send(reportfiles);
    } catch (error) {
      res.status(400).send(error);
    }
  });

router.get("/reportfile", async (req, res) => {
    try {
      const reports = await ReportFile.find();
      res.status(200).send(reports);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  // Get a report by ID
  router.get("/reportfile/:id", async (req, res) => {
    try {
      const report = await ReportFile.findById(req.params.id);
      if (!report) {
        return res.status(404).send();
      }
      res.status(200).send(report);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  // Update a report by ID
  router.patch("/reportfile/:id", async (req, res) => {
    try {
      const report = await ReportFile.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!report) {
        return res.status(404).send();
      }
      res.status(200).send(report);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  // Delete a report by ID
  router.delete("/reportfile/:id", async (req, res) => {
    try {
      const report = await ReportFile.findByIdAndDelete(req.params.id);
      if (!report) {
        return res.status(404).send();
      }
      res.status(200).send(report);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //update report
  router.put("/reportfile/:id", async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body; // This should match the structure of your report
  
    try {
      // Assuming you are using a database like MongoDB
      const result = await ReportFile.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!result) {
        return res.status(404).send("Report not found");
      }
      res.send(result);
    } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).send("Error updating report");
    }
  });

  module.exports= router;