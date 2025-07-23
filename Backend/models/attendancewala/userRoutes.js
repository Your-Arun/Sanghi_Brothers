const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  searchUsers,
  markAttendance,
  getAttendanceByMonth,
} = require("./userController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/create", upload.single("photo"), createUser);
router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.get("/search", searchUsers);
router.post("/attendance", markAttendance);
router.get("/attendance/month", getAttendanceByMonth);

module.exports = router;
