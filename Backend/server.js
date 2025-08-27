require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

const app = express();

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads")); // photo serve karne ke liye

app.use(cookieParser());

// 🛡️ CORS Configuration
app.use(
  cors({
    origin: "https://sanghibros.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🛡️ Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET, // ✅ use proper session secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS me true
      httpOnly: true,
      sameSite: "none", // ✅ important for cross-origin cookies
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

app.options("*", cors());

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
const shiftApi = require("./models/shifting/shiftsapi");
const Attendance = require("./models/attendancewala/userRoutes");
const User = require("./routes/user");

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected 🟢"))
  .catch((err) => console.error(err));

// ✅ Public Routes
app.use("", LoginSignup);
app.use("/", Contactus);
app.use("/", Attendance);
app.use("/", User);
// ✅ Protected Routes
app.use("/bank", FlowRoute);
app.use("/bank", Monthlyfundflow);
app.use("/mastersheet", PumpReport);
app.use("/mastersheet", SalesManagementSheet);
app.use("/mastersheet", PurchaseManagement);
app.use("/mastersheet", Lubricant);
app.use("/mastersheet", TankLorryManagement);
app.use("/mastersheet", BPCLSTATUTORY);
app.use("/mastersheet", Staffmng);
app.use("/mastersheet", Financemng);
app.use("/newlekhajokha", Lekha);
app.use("/shifting", ShiftingRoutes);
app.use("/", MeterClose);
app.use("/", ReportFile);
app.use("/", ExcelSheet);
app.use("/", DepositRoute);
app.use("/", CashSlip);
app.use("/", FundPosition);
app.use("/", ReportComplaint);
app.use("/", shiftApi);

// ✅ Root
app.get("/", (req, res) => {
  res.status(200).send({ message: "Backend live ✅" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} 🚀`)
);
