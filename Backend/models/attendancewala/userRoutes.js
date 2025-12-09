const express = require("express");
const router = express.Router();
const User = require("../user");
const Attendance = require("../attendancewala/Attendance");
const bcrypt = require("bcryptjs");

// 1️⃣ Cloudinary aur Multer Imports
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config(); // Environment variables ke liye

// 2️⃣ Cloudinary Configuration (Apne credentials .env file me rakhein ya yahan direct dalein)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Ya direct string likhein
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// 3️⃣ Multer Storage Setup (Direct Cloudinary pe upload ke liye)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "employee_photos", // Cloudinary me folder ka naam
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed file types
  },
});

const upload = multer({ storage: storage });


// ✅ Users with attendance (monthly filter)
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


router.post("/users", upload.single("photo"), async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file); // Yahan Cloudinary ka data aayega

    const { password, ...rest } = req.body;

    // Password validation
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Password Hash karein
    const hashedPassword = await bcrypt.hash(password, 10);

    // Agar image upload hui hai to uska Cloudinary URL lein, warna empty string
    const photoUrl = req.file ? req.file.path : ""; 

    const newUser = new User({
      ...rest,
      password: hashedPassword,
      photo: photoUrl, // Cloudinary URL database me save hoga
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

router.get("/user-attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    // Start: YYYY-MM-01
    const startDate = new Date(year, month - 1, 1);
    // End: last day of that month
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const records = await Attendance.find({
      userId: id,
      date: { $gte: startDate, $lte: endDate },
    });

    res.json(records);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 📌 Monthly Attendance API
router.get("/monthly-attendance", async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year are required" });
    }

    // Start and end date range
    const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Fetch attendance data from DB
    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("userId", "name");

    // ✅ Normalize data by user + date (remove time, keep only YYYY-MM-DD)
    const formattedData = {};

    attendance.forEach((record) => {
      if (!record.userId) return; // skip if user not found

      const name = record.userId.name;
      if (!formattedData[name]) formattedData[name] = { name, attendance: {} };

      const dateOnly = new Date(record.date).toISOString().split("T")[0]; // YYYY-MM-DD
      formattedData[name].attendance[dateOnly] = record.status;
    });

    res.json(Object.values(formattedData));
  } catch (err) {
    console.error("Error fetching monthly attendance:", err);
    res.status(500).json({ message: "Error fetching monthly attendance" });
  }
});

module.exports = router;