const User = require("../user");
const Attendance = require("./Attendance");
const fs = require("fs");

exports.createUser = async (req, res) => {
  try {
    const photo = req.file?.filename;
    const newUser = new User({ ...req.body, photo });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  const users = await User.find({ name: new RegExp(query, "i") });
  res.json(users);
};

exports.markAttendance = async (req, res) => {
  const { userId, date, checkIn, checkOut } = req.body;
  const status = checkIn && checkOut ? "Present" : "Absent";

  let record = await Attendance.findOne({ user: userId, date });

  if (record) {
    record.checkIn = checkIn || record.checkIn;
    record.checkOut = checkOut || record.checkOut;
    record.status = status;
  } else {
    record = new Attendance({ user: userId, date, checkIn, checkOut, status });
  }

  await record.save();
  res.json(record);
};

exports.getAttendanceByMonth = async (req, res) => {
  const { month, year } = req.query;

  const start = new Date(`${year}-${month}-01`);
  const end = new Date(start);
  end.setMonth(start.getMonth() + 1);

  const records = await Attendance.find({
    date: { $gte: start.toISOString().split("T")[0], $lt: end.toISOString().split("T")[0] },
  }).populate("user");

  const result = {};
  records.forEach((rec) => {
    const uid = rec.user._id.toString();
    if (!result[uid]) result[uid] = { user: rec.user, present: 0, absent: 0 };
    if (rec.status === "Present") result[uid].present++;
    else result[uid].absent++;
  });

  res.json(Object.values(result));
};
