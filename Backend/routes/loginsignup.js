const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const Router = express.Router();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch correct user and attach to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(404).json({ message: "User not found" });

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ message: "Invalid token" });
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

Router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🔥 Always generate a new token for each login
  const token = jwt.sign(
    { id: user._id, username: user.username, department: user.department },
    "yourstrongsecretkey",
    { expiresIn: "1h" }
  );

  user.tokens = [token]; // 🛑 Store only the latest token
  await user.save();

  res.json({ token, user });
});


// ✅ Verify Invitation Code
Router.post("/verify-invite", (req, res) => {
  const { invitationCode } = req.body;

  const validCodes = process.env.VALID_INVITATION_CODES;
  const staffCodes = process.env.VALID_INVITATION_CODES_FOR_STAFF;

  if (validCodes.includes(invitationCode)) {
    res.json({ valid: true, department: "members" });
  } else if (staffCodes.includes(invitationCode)) {
    res.json({ valid: true, staff: true, department: "staff" });
  } else {
    res.json({ valid: false });
  }
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


Router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "yourSecretKey");

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token, please log in again" });
  }
});

Router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, username, email, department } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // ✅ Check if the username or email is already taken
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }], 
      _id: { $ne: req.user._id } // Exclude current user
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
      req.user._id,
      { $set: updatedFields },
      { new: true, select: "-password -currentToken" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

Router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id username email department"); // ✅ Sirf important fields fetch karo

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json({ success: true, users });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
Router.get("/user-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// ✅ Secure Logout Route
Router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Clear token (Modify if storing multiple tokens)
    user.tokens = [];
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = Router;
