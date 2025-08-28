const express = require("express");
const Router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");

// Upload folder
const uploadFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Update user
Router.put("/users/:id", upload.single("photo"), async (req, res) => {
    try {
      const updatedData = { ...req.body };
  
      if (req.file) {
        updatedData.photo = `https://${req.get("host")}/uploads/${req.file.filename}`;
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      ).select("-password");
  
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  });

// ✅ Delete user
Router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
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
