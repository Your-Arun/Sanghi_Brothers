const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const Router = express.Router();

// ✅ Middleware to verify token
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; // Consistent token usage
  if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // ✅ Ensure userId is set correctly
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// ✅ Secure Signup Route
Router.post("/signup", async (req, res) => {
  try {
    let { name, username, email, password, department } = req.body;
    name = name.trim();
    username = username.trim();
    email = email.trim();
    department = department.toLowerCase();

    const validDepartments = ["manager", "backoffice", "accounts/finance", "staff"];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({ message: "Invalid department selected" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, email, password: hashedPassword, department });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

// ✅ Login Route (Fixed double response issue)
Router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  req.session.user = { id: user._id, name:user.name,username:user.username, email: user.email, department: user.department };
  res.json({ message: 'Login successful', user: req.session.user });
});

// ✅ Forgot Password - Send OTP
Router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // ✅ OTP valid for 10 minutes
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp} (valid for 10 minutes)`,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Profile Route (Fixed missing token validation)
Router.get('/profile', (req, res) => {
  if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized: No session found' });
  }
  res.json({ user: req.session.user });
});

// ✅ Update Profile Route (Fixed userId usage)
Router.put("/profile", authenticateUser, async (req, res) => {
  try {
    const { name, username, email, department } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // ✅ Check if the username or email is already taken
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: req.userId }, // Exclude current user
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already in use." });
    }

    // ✅ Only update fields that are provided
    const updatedFields = {};
    if (name) updatedFields.name = name.trim();
    if (username) updatedFields.username = username.trim();
    if (email) updatedFields.email = email.trim();
    if (department) updatedFields.department = department.toLowerCase();

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updatedFields },
      { new: true, select: "-password" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Secure Logout Route (Fixed session destroy)
Router.post("/logout", (req, res) => {
  res.clearCookie("token"); // ✅ Ensure cookie is removed
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    console.log("✅ Session Destroyed");
    res.json({ message: "Logged out successfully" });
  });
});

// ✅ Verify OTP & Reset Password
Router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});


Router.get("/departments", async (req, res) => {
  try {
    const departments = await User.distinct("department");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = Router;
