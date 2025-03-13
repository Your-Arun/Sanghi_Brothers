const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cookieParser());
// 🛡️ Session Configuration
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛡️ CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // ✅ Allow cookies & authentication headers
  })
);






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
app.use("/bank",  FlowRoute);
app.use("/bank",  Monthlyfundflow);
app.use("/mastersheet",  PumpReport);
app.use("/mastersheet",  SalesManagementSheet);
app.use("/mastersheet",  PurchaseManagement);
app.use("/mastersheet",  Lubricant);
app.use("/mastersheet",  TankLorryManagement);
app.use("/mastersheet",  BPCLSTATUTORY);
app.use("/mastersheet",  Staffmng);
app.use("/mastersheet",  Financemng);
app.use("/newlekhajokha",  Lekha);
app.use("/shifting",  ShiftingRoutes);
app.use("/",  MeterClose);
app.use("/",  ReportFile);
app.use("/",  ExcelSheet);
app.use("/",  DepositRoute);
app.use("/",  CashSlip);
app.use("/",  FundPosition);
app.use("/",  ReportComplaint);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔴🔴`));
