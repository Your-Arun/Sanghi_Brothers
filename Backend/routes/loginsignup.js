const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const Router = express.Router();
require("dotenv").config();


// ✅ Middleware to verify token
const authenticateUser = async(req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Extract token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
// ✅ Middleware to Verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // ✅ Check both header & cookies

  if (!token) return res.status(401).json({ message: "Unauthorized: No session found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Store user data in request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired" });
  }
};
// ✅ Secure Signup Route
Router.post("", async (req, res) => {
  try {
    let { name, username, email,phone, password, department } = req.body;
    name = name;
    username = username;
    email = email;
    phone =phone;
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
    const newUser = new User({ name, username, email,phone, password: hashedPassword, department });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});
// ✅ Login Route (Fixed double response issue)
Router.post("", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Hardcoded Admin Credentials
    if (email === process.env.GMAIL && password === process.env.Password) {
      const token = jwt.sign({ department: "admin" }, process.env.JWT_SECRET, { expiresIn: "4h" });

      res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
      return res.json({ user: { email, department: "admin" }, token });
    }

    // ✅ Normal User Login (Database Check)
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ userId: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "4h" });

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
    res.json({ user, token });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Profile Route (Fixed missing token vali  dation)
Router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json({ user });
  } catch {
    res.status(500).json({ message: "User not found" });
  }
});
// ✅ Update Profile Route (Fixed userId usage)
Router.put("/profile", authenticateUser, async (req, res) => {
  try {
    const { name, username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // ✅ Check for existing username
    const existingUser = await User.findOne({ username, _id: { $ne: req.userId } });

    if (existingUser) {
      return res.status(400).json({ message: "Username already in use." });
    }

    // ✅ Update fields only if provided
    const updatedFields = {};
    if (name) updatedFields.name = name.trim();
    if (username) updatedFields.username = username.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updatedFields },
      { new: true, select: "-password" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("❌ Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Secure Logout Route (Fixed session destroy)
Router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});
Router.get("/departments", async (req, res) => {
  try {
    const departments = await User.distinct("department");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ Fetch all users
Router.get("/users",  async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
// ✅ Update user details
Router.put("/users/:id",  async (req, res) => {
  try {
    const { username, email, department ,phone} = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, department,phone },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});
// ✅ Delete a user
Router.delete("/users/:id",  async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});
//verify-invite
const Invitecodemembers = (process.env.VALID_INVITATION_CODES || "")
  .split(",")
  .map(code => code.trim())
  .filter(code => code !== "");

const Invitecodestaff = (process.env.VALID_INVITATION_CODES_FOR_STAFF || "")
  .split(",")
  .map(code => code.trim())
  .filter(code => code !== "");

Router.post("/verify-invite", async (req, res) => {
  const { invitecode, email } = req.body; // get email from frontend if needed

  let userType = null;

  if (Invitecodemembers.includes(invitecode)) {
    userType = "member";
  } else if (Invitecodestaff.includes(invitecode)) {
    userType = "staff";
  }

  if (!userType) {
    return res.json({ valid: false });
  }

  // You can also save user to DB here if not already
  const userPayload = {
    email,
    type: userType,
  };

  const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.json({
    valid: true,
    type: userType,
    token,
  });
});
// Router.post("/verify-invite", async (req, res) => {
//   const { invitecode } = req.body;

//   if (Invitecodemembers.includes(invitecode)) {
//     return res.json({ valid: true, type: "member" });
//   } else if (Invitecodestaff.includes(invitecode)) {
//     return res.json({ valid: true, type: "staff" });
//   } else {
//     return res.json({ valid: false });
//   }
// });


// ✅ Forgot Password - Send OTP
Router.post("/forgot-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found." });

    // ✅ Step 1: Generate and send OTP
    if (!otp && !newPassword) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(generatedOtp, 10);

      user.otp = hashedOtp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // FIXED ✅ Ensure proper Date format
      await user.save();

      // Email Transporter Setup
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Send OTP Email
      await transporter.sendMail({
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${generatedOtp} (valid for 10 minutes). If you did not request this, ignore this email.`,
      });

      return res.status(200).json({ message: "OTP sent to your email." });
    }

    // ✅ Step 2: Verify OTP and reset password
    if (otp && newPassword) {
    
      // Check if OTP is expired
      if (!user.otp || !user.otpExpires || new Date(user.otpExpires) < new Date()) {
      
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        return res.status(400).json({ message: "OTP expired. Request a new one." });
      }

      // Verify OTP
      const isOtpValid = await bcrypt.compare(otp, user.otp);
      if (!isOtpValid) return res.status(400).json({ message: "Invalid OTP." });

      // Hash new password and update user record
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      return res.status(200).json({ message: "Password has been reset successfully." });
    }

    res.status(400).json({ message: "Invalid request." });
  } catch (error) {
    console.error("Error in forgot-password API:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



Router.post("/google-auth", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;
 // 🔥 Check if user exists
 let user = await User.findOne({ email });

 if (!user) {
   // 👇 If not, create user with default role "member"
   user = await User.create({
     email,
     name,
     picture,
     department: "", // default or update later using invite code
     authType: "google"
   });
 }

 return res.status(200).json({
   user: {
     _id: user._id,
     email: user.email,
     name: user.name,
     picture: user.picture,
     department: user.department
   },
   message: "Google user authenticated",
 });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Google token" });
  }
});


module.exports = Router;
