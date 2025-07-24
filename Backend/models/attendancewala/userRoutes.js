const express = require("express");
const router = express.Router();
const User = require("../user");
const Attendance = require("../attendancewala/Attendance");

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
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(400).json({ error: err.message });
  }
});


router.post("/attendance", async (req, res) => {
  try {
    const { userId, date, status, checkIn, checkOut } = req.body;

    const existing = await Attendance.findOne({ userId, date });

    if (existing) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const record = new Attendance({ userId, date, status, checkIn, checkOut });
    await record.save();

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});


module.exports = router;