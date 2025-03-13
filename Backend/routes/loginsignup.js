const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const Router = express.Router();
const tokenBlacklist = new Set();

// Ensure token isn't reused
const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });

    req.user = decoded;
    next();
  });
};
const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken; // Fetch token from HttpOnly Cookie

  if (!token) return res.status(401).json({ message: "Unauthorized access" });

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded; // Attach user info to request
    next();
  });
};


module.exports = verifyToken;



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

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // ✅ Set token in HttpOnly cookie
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: false, // ✅ Set true in production (HTTPS required)
    sameSite: "Lax", // ✅ Helps with CSRF protection
  });

  res.json({ message: "Login successful" });
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
  const token = req.cookies.authToken; // ✅ Read token from cookies
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "secret_key");
    const user = await User.findById(decoded.id).select("-password"); // ✅ Exclude password

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
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
Router.post("/logout", authMiddleware, (req, res) => {
  tokenBlacklist.add(req.token);
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});




module.exports = Router;
