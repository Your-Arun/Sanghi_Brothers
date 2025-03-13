const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

// 🛡️ CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // ✅ Allow cookies & authentication headers
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Ensure Authorization is allowed
  })
);


// 🛡️ Session Configuration
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 4 * 60 * 60, // 4 hours
    }),
    rolling: true, // Refresh session expiry on every request
    cookie: {
      httpOnly: true,
      secure: false, // ✅ Agar HTTPS use nahi kar rahe ho
      sameSite: "lax", // ✅ Cross-origin issues fix karega
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



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
