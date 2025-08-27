const express = require("express");
const Router = express.Router();
const multer = require("multer");
const User = require("../models/user");

// Photo upload ke liye multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Get all users
Router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Update user
Router.put("/users/:id", upload.single("photo"), async (req, res) => {
    try {
      let updatedData = req.body;
  
      // agar nayi file hai → path se overwrite karo
      if (req.file) {
        updatedData.photo = `/uploads/${req.file.filename}`;
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );
  
      res.json(updatedUser);
    } catch (err) {
      console.error("Update failed:", err);
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

module.exports = Router;
