// const express = require("express");
// const router = express.Router();
// const Shift = require("./shifts");

// // Save Shift Data API
// router.post("/shiftingsavee", async (req, res) => {
//     try {
//         const shiftsData = req.body; // Array of shifts

//         if (!Array.isArray(shiftsData) || shiftsData.length === 0) {
//             return res.status(400).json({ error: "Invalid shift data" });
//         }

//         // Save all shift data in the database
//         const savedShifts = await Shift.insertMany(shiftsData);

//         res.status(201).json({ message: "Shifts saved successfully", shifts: savedShifts });
//     } catch (error) {
//         console.error("Error saving shifts:", error);
//         res.status(500).json({ error: "Failed to save shift data" });
//     }
// });

// // 📌 GET API to fetch shifts by date
// router.get("/getshifts", async (req, res) => {
//     let { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: "Date is required" });
//     }
  
//     try {
//       const shifts = await Shift.find({ date }); // Directly match "YYYY-MM-DD" format
//       res.json({ shifts });
//     } catch (error) {
//       console.error("Error fetching shifts:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });

// // ✅ API to Fetch All Saved Shifts
// router.get("/allshifts", async (req, res) => {
//   try {
//     const shifts = await Shift.find().sort({ date: -1 }); // ✅ Latest shifts first
//     res.json({ success: true, shifts });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching shifts", error });
//   }
// });


// router.delete("/shift/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedShift = await Shift.findByIdAndDelete(id);

//     if (!deletedShift) {
//       return res.status(404).json({ success: false, message: "Shift not found" });
//     }

//     res.json({ success: true, message: "Shift deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error deleting shift", error });
//   }
// });




// module.exports = router;





// routes/shifting.js
const express = require('express');
const router = express.Router();
const controller = require('./shifts');

// List all members
router.get('/', controller.listMembers);

// Add new member
router.post('/', controller.addMember);

// Delete member
router.delete('/:id', controller.deleteMember);

// Get map snapshot (by date & shift)
router.get('/get-map', controller.getMap);

// Save map snapshot
router.post('/save-map', controller.saveMap);

module.exports = router;
