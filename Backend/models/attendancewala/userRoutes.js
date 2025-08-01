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

// router.post("/users", async (req, res) => {
//   try {
//     const { password, ...rest } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       ...rest,
//       password: hashedPassword,
//     });

//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     console.error("Error creating user:", err.message);
//     res.status(400).json({ error: err.message });
//   }
// });


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

router.get("/daily-attendance", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Date is required" });

  try {
    const users = await User.find().lean();

    const data = users.map(user => {
      const isPresent = user.attendance?.some(a =>
        a.date?.startsWith(date)
      );
      return {
        _id: user._id,
        name: user.name,
        designation: user.designation,
        photo: user.photo,
        status: isPresent ? "Present" : "Absent",
      };
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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