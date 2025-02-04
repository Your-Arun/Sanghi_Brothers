const express = require("express");
const router = express.Router();
const SalesManagementSheet = require("../../models/mastersheet/salemanagemet");


router.post("/salesmanagementsheet", async (req, res) => {
        try {
            const datasheet = new SalesManagementSheet(req.body);
            await datasheet.save();
            res.status(201).send(datasheet);
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ message: "Error saving data", error: error.message });
        }
    });
 router.get("/salesmanagementsheet", async (req, res) => {
        try {
            const datasheet = await SalesManagementSheet.find();
            res.send(datasheet);
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ message: "Error fetching data", error: error.message });
        }
    });
router.get("/salesmanagementsheet/:id", async (req, res) => {
        try {
            const datasheet = await SalesManagementSheet.findById(req.params.id);
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
router.delete("/salesmanagementsheet/:id", async (req, res) => {
        try {
            const datasheet = await SalesManagementSheet.findByIdAndDelete(
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

router.put("/salesmanagementsheet/:id", async (req, res) => {
        try {
            const datasheet = await SalesManagementSheet.findByIdAndUpdate(
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