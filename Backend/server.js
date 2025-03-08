const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");

const app = express();

// 🛡️ CORS Configuration (Frontend Connection)
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend ka URL
    credentials: true, // ✅ Cookies & Sessions Allow Karega
  })
);

// 🛡️ Session Configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // ✅ Agar HTTPS use nahi kar rahe ho
      sameSite: "lax", // ✅ Cross-origin issues fix karega
    },
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());



const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // 🛠 Token Extract
  console.log("🔍 Received Auth Header:", req.headers.authorization);

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Token Verified:", decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;


// ✅ Import Routes
const FlowRoute = require("./routes/flowroutes");
const Monthlyfundflow = require("./routes/sbo3flow");
const PumpReport = require("./routes/pumproute");
const SalesManagementSheet = require("./routes/mastersheet/salemngemntroute");
const PurchaseManagement = require("./routes/mastersheet/purchaseroute");
const Lubricant = require("./routes/mastersheet/lubricantroute");
const TankLorryManagement = require("./routes/mastersheet/tanklorryroute");
const BPCLSTATUTORY = require("./routes/mastersheet/routebpclstatutory");
const Staffmng = require("./routes/mastersheet/staffroute");
const Financemng = require("./routes/mastersheet/financeroute");
const Lekha = require("./routes/routelekhajokha");
const ShiftingRoutes = require("./models/shifting/routesss");
const MeterClose = require("./routes/metercloseroute");
const ExcelSheet = require("./routes/exceslsheetuploding");
const DepositRoute = require("./routes/depositRoutes");
const CashSlip = require("./routes/cashsliproute");
const Contactus = require("./routes/contactus");
const LoginSignup = require("./routes/loginsignup");
const ReportFile = require("./routes/reportfileroute");
const FundPosition = require("./routes/fundposition");
const ReportComplaint = require("./routes/reportcomlaint");

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected 🟢🟢"))
  .catch((err) => console.error(err));

// ✅ Public Routes (No Authentication Required)
app.use("/", LoginSignup);
app.use("/", Contactus);

// ✅ Protected Routes (Authentication Required)
app.use("/bank", verifyToken, FlowRoute);
app.use("/bank", verifyToken, Monthlyfundflow);
app.use("/mastersheet", verifyToken, PumpReport);
app.use("/mastersheet", verifyToken, SalesManagementSheet);
app.use("/mastersheet", verifyToken, PurchaseManagement);
app.use("/mastersheet", verifyToken, Lubricant);
app.use("/mastersheet", verifyToken, TankLorryManagement);
app.use("/mastersheet", verifyToken, BPCLSTATUTORY);
app.use("/mastersheet", verifyToken, Staffmng);
app.use("/mastersheet", verifyToken, Financemng);
app.use("/newlekhajokha", verifyToken, Lekha);
app.use("/shifting", verifyToken, ShiftingRoutes);
app.use("/", verifyToken, MeterClose);
app.use("/", verifyToken, ReportFile);
app.use("/", verifyToken, ExcelSheet);
app.use("/", verifyToken, DepositRoute);
app.use("/", verifyToken, CashSlip);
app.use("/", verifyToken, FundPosition);
app.use("/", verifyToken, ReportComplaint);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔴🔴`));
