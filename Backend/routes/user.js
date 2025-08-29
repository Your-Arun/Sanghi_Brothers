const express = require("express");
const Router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");

// ✅ Upload folder setup
const uploadFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// ✅ Multer setup for all image types
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg/.png/.jpeg
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Filter only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(new Error("Only JPEG, JPG and PNG files are allowed"));
};

const upload = multer({ storage, fileFilter });

// ✅ Update user (photo + other fields)
Router.put("/users/:id", upload.single("photo"), async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      // Full URL for frontend
      const protocol = req.protocol;
      const host = req.get("host");
      updatedData.photo = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Update failed" });
  }
});

// ✅ Delete user
Router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Delete failed" });
  }
});

// ✅ Get all users
Router.get("/users", async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

module.exports = Router;
