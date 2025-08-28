const express = require("express");
const router = express.Router();
const User = require("../user");
const Attendance = require("../attendancewala/Attendance");
const bcrypt = require("bcryptjs");

// ✅ Get users with attendance (with pagination)
router.get("/users/attendance", async (req, res) => {
  try {
    const { month, year, page = 1, limit = 10 } = req.query;
    if (!month || !year)
      return res.status(400).json({ error: "Month and year required" });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Parallel fetch
    const [users, attendanceRecords, totalUsers] = await Promise.all([
      User.find()
        .select("-password")
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean(),
      Attendance.find({ date: { $gte: startDate, $lte: endDate } }).lean(),
      User.countDocuments(),
    ]);

    // Map attendance by userId
    const attendanceMap = {};
    attendanceRecords.forEach((att) => {
      const uid = att.userId.toString();
      if (!attendanceMap[uid]) attendanceMap[uid] = [];
      attendanceMap[uid].push(att);
    });

    const usersWithAttendance = users.map((user) => ({
      ...user,
      attendance: attendanceMap[user._id.toString()] || [],
      attendanceCount: (attendanceMap[user._id.toString()] || []).length,
    }));

    res.json({
      users: usersWithAttendance,
      page: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users with attendance" });
  }
});

// ✅ Daily attendance
router.get("/daily-attendance", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const logs = await Attendance.find({ date })
      .populate("userId", "name photo designation")
      .lean();

    const result = logs.map((log) => ({
      _id: log.userId?._id,
      name: log.userId?.name,
      photo: log.userId?.photo,
      designation: log.userId?.designation,
      status: log.status,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance." });
  }
});

// ✅ Monthly attendance summary
router.get("/monthly-attendance", async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year)
      return res.status(400).json({ error: "Month and year required" });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("userId", "name")
      .lean();

    const formattedData = {};
    attendance.forEach((record) => {
      if (!record.userId) return;
      const name = record.userId.name;
      if (!formattedData[name]) formattedData[name] = { name, attendance: {} };
      const dateOnly = new Date(record.date).toISOString().split("T")[0];
      formattedData[name].attendance[dateOnly] = record.status;
    });

    res.json(Object.values(formattedData));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch monthly attendance" });
  }
});

// ✅ Mark bulk attendance
router.post("/mark-attendance", async (req, res) => {
  try {
    const attendanceList = req.body; // [{ userId, date, status }]
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
    console.error(err);
    res.status(500).json({ error: "Failed to mark attendance." });
  }
});

// ✅ Create user
router.post("/users", async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...rest, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ Fetch single user monthly attendance
router.get("/user-attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month } = req.query;
    if (!year || !month)
      return res.status(400).json({ message: "Year and month required" });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const records = await Attendance.find({
      userId: id,
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
