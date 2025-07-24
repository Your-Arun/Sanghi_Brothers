const express = require("express");
const router = express.Router();
const User = require("../user");
const Attendance = require("../attendancewala/Attendance");

// GET all users with attendance count for a given month/year
router.get("/users/attendance", async (req, res) => {
  const { month, year } = req.query;
  try {
    const users = await User.find();

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const regex = new RegExp(`^${year}-${String(month).padStart(2, "0")}`);
        const attendanceCount = await Attendance.countDocuments({
          userId: user._id,
          date: { $regex: regex },
        });
        return {
          ...user.toObject(),
          attendanceCount,
        };
      })
    );

    res.json(enrichedUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST: Create a new user
router.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const result = await newUser.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: "Failed to add user", details: err.message });
  }
});





// GET attendance for a user for a specific month/year
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { month, year } = req.query;

  try {
    const regex = new RegExp(`^${year}-${String(month).padStart(2, "0")}`);
    const records = await Attendance.find({
      userId,
      date: { $regex: regex },
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// POST attendance record
router.post("/", async (req, res) => {
  try {
    const record = new Attendance(req.body);
    const saved = await record.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to save attendance", details: err.message });
  }
});


module.exports = router;
