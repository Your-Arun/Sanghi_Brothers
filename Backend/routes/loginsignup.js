const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const Router = express.Router();


const authMiddleware = async (req, res, next) => {
  try {
    console.log("🟢 Cookies received:", req.cookies); // Check if cookies are coming
    const token = req.cookies.authToken; 
    console.log("🟢 Token extracted:", token); // Check if token is extracted

    if (!token) return res.status(401).json({ message: "Unauthorized - No Token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟢 Decoded token:", decoded); // Check if token decoding is working

    const user = await User.findById(decoded.id);
    console.log("🟢 User found in DB:", user); // Check if user exists

    if (!user || user.currentToken !== token) {
      return res.status(403).json({ message: "Session expired, please login again" });
    }

    const expiryTime = decoded.exp * 1000;
    if (Date.now() > expiryTime) {
      return res.status(403).json({ message: "Session expired, please login again" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth Error:", err);
    res.status(403).json({ message: "Invalid session" });
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
  try {
    console.log("🔍 Full Headers:", req.headers); // ✅ Debugging ke liye
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true, // ✅ Prevent client-side access
      secure: false,  // ✅ Set to true in production (HTTPS required)
      sameSite: "lax", // ✅ Adjust if needed (try "none" with secure: true for cross-origin)
    });
    
    console.log("🟢 Token Generated:", token); // ✅ Debugging
    console.log("🟢 Sent Token in Response & Cookie"); // ✅ Debugging

    return res.json({ user, token }); // ✅ Ensure token is in response
  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});





// ✅ Secure Logout Route
Router.post('/logout', (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ message: "No active session found" });
  }
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie('connect.sid'); // If using express-session
    res.json({ message: "Logged out successfully" });
  });
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
    const hashedOtp = await bcrypt.hash(otp, 10); // ✅ Hash the OTP
    user.otp = hashedOtp;
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
      text: `Your OTP for password reset is: ${otp}`,
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

    // ✅ Compare hashed OTP
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
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


Router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id, { password: 0, currentToken: 0 });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

Router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { username } },
      { new: true, select: "-password -currentToken" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
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
Router.get('/check-session', (req, res) => {
  if (req.session.user) {
    return res.json({ active: true });
  }
  return res.json({ active: false });
});


module.exports = Router;
