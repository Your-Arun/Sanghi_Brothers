const express = require("express");
const router = express.Router();
const User = require("../user");
const Attendance = require("../attendancewala/Attendance");
const bcrypt = require("bcryptjs");



router.post("/users", async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ...rest,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(400).json({ error: err.message });
  }
});

router.post("/mark-attendance", async (req, res) => {
  try {
    const attendanceList = req.body; // Array of { userId, date, status }

    const bulkOps = attendanceList.map((entry) => ({
      updateOne: {
        filter: { userId: entry.userId, date: entry.date },
        update: { $set: { status: entry.status } },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    res.json({ message: "Attendance marked successfully." });
  } catch (err) {
    console.error("Error marking bulk attendance:", err);
    res.status(500).json({ error: "Failed to mark attendance." });
  }
});



router.get("/daily-attendance", async (req, res) => {
  try {
    const { date } = req.query;
    const logs = await Attendance.find({ date }).populate("userId", "name photo designation");
    
    const result = logs.map((log) => ({
      _id: log.userId._id,
      name: log.userId.name,
      photo: log.userId.photo,
      designation: log.userId.designation,
      status: log.status,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attendance." });
  }
});



module.exports = router;