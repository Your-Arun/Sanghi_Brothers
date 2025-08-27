const express = require("express");
const Router = express.Router();
const multer = require("multer");
const User = require("../models/user");


// multer setup (memory storage ya disk storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder create karna padega project me
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: storage });

// Update user with file support
Router.put("/users/:id", upload.single("photo"), async (req, res) => {
  try {
    let updatedData = { ...req.body };

    // agar photo file aayi hai
    if (req.file) {
      updatedData.photo = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).select("-password");

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
