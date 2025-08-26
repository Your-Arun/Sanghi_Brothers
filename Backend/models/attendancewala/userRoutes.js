const express = require("express");
const router = express.Router();
const User = require("../user");
const Attendance = require("../attendancewala/Attendance");
const bcrypt = require("bcryptjs");

// ✅ Get all users with attendance for selected month/year
router.get("/users/attendance", async (req, res) => {
  try {
    const { month, year } = req.query;

    const users = await User.find();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const usersWithAttendance = users.map((user) => {
      const userAttendance = attendanceRecords.filter(
        (record) => record.userId.toString() === user._id.toString()
      );

      return {
        ...user.toObject(),
        attendance: userAttendance,
        attendanceCount: userAttendance.length,
      };
    });

    res.json(usersWithAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users with attendance" });
  }
});




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
      status: log.status, // "Present", "Absent", "Leave"
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attendance." });
  }
});


// ✅ Route: GET /api/monthly-attendance?month=08&year=2025
router.get("/monthly-attendance", async (req, res) => {
  try {
    const { month, year } = req.query;

    const users = await User.find();
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(year, parseInt(month), 0); // last date of month

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate("userId", "name");

    // Normalize
    const attendanceMap = {};
    users.forEach((user) => {
      attendanceMap[user._id] = {
        name: user.name,
        attendance: {},
      };
    });

    attendance.forEach((record) => {
      const dateKey = new Date(record.date).toISOString().split("T")[0]; // ✅ YYYY-MM-DD
      if (attendanceMap[record.userId._id]) {
        attendanceMap[record.userId._id].attendance[dateKey] = record.status;
      }
    });

    res.json(Object.values(attendanceMap));
  } catch (err) {
    console.error("Error fetching monthly attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const Attendance = require("../models/Attendance");
const User = require("../models/User");

app.get("/monthly-attendance", async (req, res) => {
  try {
    const { month, year } = req.query;

    const users = await User.find();
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(year, parseInt(month), 0); // last date of month

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate("userId", "name");

    // Normalize
    const attendanceMap = {};
    users.forEach((user) => {
      attendanceMap[user._id] = {
        name: user.name,
        attendance: {},
      };
    });

    attendance.forEach((record) => {
      const dateKey = new Date(record.date).toISOString().split("T")[0]; // ✅ YYYY-MM-DD
      if (attendanceMap[record.userId._id]) {
        attendanceMap[record.userId._id].attendance[dateKey] = record.status;
      }
    });

    res.json(Object.values(attendanceMap));
  } catch (err) {
    console.error("Error fetching monthly attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/user-attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    // Ensure month is always 2 digits
    const monthStr = String(month).padStart(2, "0");

    // Regex to match YYYY-MM dates
    const regex = new RegExp(`^${year}-${monthStr}`);

    const records = await Attendance.find({
      userId: id,
      date: { $regex: regex },
    });

    res.json(records);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;