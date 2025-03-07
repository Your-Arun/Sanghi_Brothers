const express =require('express')
const router =express.Router()
const SBI_02_Bank= require('../models/sbi01')

//sbi01 report file saving
router.post("/fundposition", async (req, res) => {
    try {
      const sbireport = new SBI_02_Bank(req.body);
      await sbireport.save();
      res.status(200).send("Report saved successfully");
    } catch (error) {
      res.status(500).send(error);
    }
  });
  router.get("/fundposition", async (req, res) => {
    try {
      const fundPositions = await SBI_02_Bank.find();
      res.json(fundPositions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  //sbi01 report file saving update
  router.get("/fundposition/:id", async (req, res) => {
    try {
      const fundPosition = await SBI_02_Bank.findById(req.params.id);
      if (!fundPosition)
        return res.status(404).json({ message: "Fund position not found" });
      res.json(fundPosition);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.put("/fundposition/:id", async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body; // This should match the structure of your report
  
    try {
      // Assuming you are using a database like MongoDB
      const result = await SBI_02_Bank.findByIdAndUpdate(id, updatedData, {
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
  router.patch("/fundposition/:id", async (req, res) => {
    try {
      const report = await SBI_02_Bank.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!report) {
        return res.status(404).send();
      }
      res.status(200).send(report);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  router.delete("/fundposition/:id", async (req, res) => {
    try {
      const report = await SBI_02_Bank.findByIdAndDelete(req.params.id);
      if (!report) {
        return res.status(404).send();
      }
      res.status(200).send(report);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  module.exports= router;