const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bodyparser = require("body-parser");


const cors = require("cors");
require("dotenv").config();
const ReportFile = require("./models/reportfile");
const Reports = require("./models/report");
const SBI_02_Bank = require("./models/sbi01");
const FlowRoute = require('./routes/flowroutes');
const Monthlyfundflow= require('./routes/sbo3flow');
const PumpReport = require("./routes/pumproute");
const SalesManagementSheet = require("./routes/mastersheet/salemngemntroute");
const PurchaseManagement= require("./routes/mastersheet/purchaseroute");
const Lubricant= require("./routes/mastersheet/lubricantroute");
const TankLorryManagement=require('./routes/mastersheet/tanklorryroute')
const BPCLSTATUTORY= require('./routes/mastersheet/routebpclstatutory')
const Staffmng =require('./routes/mastersheet/staffroute')
const Financemng =require('./routes/mastersheet/financeroute')
const Lekha= require('./routes/routelekhajokha')
const ShiftingRoutes = require('./models/shifting/routesss');
const MeterClose = require('./routes/metercloseroute');
const Excelsheet = require('./routes/exceslsheetuploding')
const DepostRoute=require('./routes/depositRoutes')
const CashSlip = require('./routes/cashsliproute')




const app = express();
app.use(bodyparser.json());
app.use(express.json());
app.use(cors());
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI,)
  .then(() => console.log("MongoDB connected 🟢🟢"))
  .catch((err) => console.error(err));
//save flow data
app.use('/bank', FlowRoute);
app.use('/bank',FlowRoute);
app.use('/bank',FlowRoute);
app.use('/bank',FlowRoute);
//saving monthly flow fund data
app.use('/bank',Monthlyfundflow);
app.use('/bank',Monthlyfundflow);
app.use('/bank',Monthlyfundflow);
app.use('/bank',Monthlyfundflow);
app.use('/bank',Monthlyfundflow);
app.use('/bank',Monthlyfundflow);
app.use('/bank',Monthlyfundflow);
//mastersheet calling
app.use('/mastersheet',PumpReport);
app.use('/mastersheet',SalesManagementSheet);
app.use('/mastersheet',PurchaseManagement);
app.use('/mastersheet',Lubricant);
app.use('/mastersheet',TankLorryManagement);
app.use('/mastersheet',BPCLSTATUTORY);
app.use('/mastersheet',Staffmng);
app.use('/mastersheet',Financemng);
app.use('/newlekhajokha',Lekha);
app.use('',MeterClose);
// Middleware to Verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
// User Registration
app.post("/signup", async (req, res) => {
  try {
    const { name, username, email, password, department } = req.body;

    // Validate department
    if (!["manager", "backoffice", "accounts"].includes(department)) {
      return res.status(400).json({ message: "Invalid department" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      department,
    });
    const savedUser = await newUser.save();

    // Generate token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with success message and token
    res.status(201).json({ message: "User  registered successfully", token });
  } catch (err) {
    console.error("Error during signup:", err); // Log the error
    res.status(500).json({ error: err.message });
  }
});
// User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Please check your password" });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        department: user.department,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Route to handle forgot password and send OTP
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User  not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.otp = otp; // Store OTP in user document
    await user.save();

    // Send OTP via email
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
// Route to verify OTP and reset password
app.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User  not found" });

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null; // Clear OTP after successful reset
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Get Departments
app.get("/departments", authMiddleware, async (req, res) => {
  try {
    const departments = await User.distinct("department");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//reportfile saving
app.post("/reportfile", async (req, res) => {
  try {
    const reportfiles = new ReportFile(req.body);
    await reportfiles.save();
    res.status(201).send(reportfiles);
  } catch (error) {
    res.status(400).send(error);
  }
});
// Get all reports
app.get("/reportfile", async (req, res) => {
  try {
    const reports = await ReportFile.find();
    res.status(200).send(reports);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Get a report by ID
app.get("/reportfile/:id", async (req, res) => {
  try {
    const report = await ReportFile.findById(req.params.id);
    if (!report) {
      return res.status(404).send();
    }
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Update a report by ID
app.patch("/reportfile/:id", async (req, res) => {
  try {
    const report = await ReportFile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!report) {
      return res.status(404).send();
    }
    res.status(200).send(report);
  } catch (error) {
    res.status(400).send(error);
  }
});
// Delete a report by ID
app.delete("/reportfile/:id", async (req, res) => {
  try {
    const report = await ReportFile.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).send();
    }
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send(error);
  }
});
//update report
app.put("/reportfile/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; // This should match the structure of your report

  try {
    // Assuming you are using a database like MongoDB
    const result = await ReportFile.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!result) {
      return res.status(404).send("Report not found");
    }
    res.send(result);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).send("Error updating report");
  }
});
// Create a Report
app.post("/report", authMiddleware, async (req, res) => {
  const { title, department, content } = req.body;

  if (!title || !department || !content) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newReport = new Reports({
      title,
      department,
      content,
      createdBy: req.user.id, // Assuming `req.user` is populated by `authenticate`
    });

    await newReport.save();
    res.status(201).json({ message: "Report saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save the report." });
  }
});
// Fetch Reports for a Department
app.get("/reports", authMiddleware, async (req, res) => {
  try {
    const reportss = await Reports.find({});
    res.json(reportss);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});
// complaint ke lie h
app.put("/reports/:id", async (req, res) => {
  try {
    const { title, content } = req.body; // assuming you're updating the content
    const reportId = req.params.id;

    // Update the report in the database (example with MongoDB)
    const updatedReport = await Reports.findByIdAndUpdate(
      reportId,
      { title, content }, // Assuming you're only updating the content
      { new: true } // Return the updated report
    );

    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (err) {
    console.error("Error updating report:", err);
    res.status(500).json({ error: "Failed to update report" });
  }
});
// Get Profile
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the token
    const user = await User.findById(userId, { password: 0 }); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the token
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  otp: { type: String }, // Store OTP temporarily
});
const User = mongoose.model("User", userSchema);
//sbi01 report file saving
app.post("/fundposition", async (req, res) => {
  try {
    const sbireport = new SBI_02_Bank(req.body);
    await sbireport.save();
    res.status(200).send("Report saved successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/fundposition", async (req, res) => {
  try {
    const fundPositions = await SBI_02_Bank.find();
    res.json(fundPositions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//sbi01 report file saving update
app.get("/fundposition/:id", async (req, res) => {
  try {
    const fundPosition = await SBI_02_Bank.findById(req.params.id);
    if (!fundPosition)
      return res.status(404).json({ message: "Fund position not found" });
    res.json(fundPosition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.put("/fundposition/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; // This should match the structure of your report

  try {
    // Assuming you are using a database like MongoDB
    const result = await SBI_02_Bank.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!result) {
      return res.status(404).send("Report not found");
    }
    res.send(result);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).send("Error updating report");
  }
});
app.patch("/fundposition/:id", async (req, res) => {
  try {
    const report = await SBI_02_Bank.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!report) {
      return res.status(404).send();
    }
    res.status(200).send(report);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.delete("/fundposition/:id", async (req, res) => {
  try {
    const report = await SBI_02_Bank.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).send();
    }
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Retrieve Data from MongoDB
app.use('/shifting', ShiftingRoutes);

//excelsheet uploading filess routes
app.use('', Excelsheet);
app.use('',DepostRoute)
app.use('', CashSlip)

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
