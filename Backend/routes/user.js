const express = require("express");
const Router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../models/upload");

// ✅ Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_photos", // Cloudinary ke andar ek folder ban jayega
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});

const upload = multer({ storage });

// ✅ Update user with photo
Router.put("/users/:id", upload.single("photo"), async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file && req.file.path) {
      updatedData.photo = req.file.path; // Cloudinary ka URL aa jayega
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

Router.get("/users/:id/photo", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("photo");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, photo: user.photo });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch photo" });
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
