require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");


const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(cookieParser());

// 🛡️ CORS Configuration
app.use(
  cors({
    origin: 'https://sanghibros.vercel.app', // ✅ Allow your Vercel frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ Allow cookies & authentication headers
  })
);
app.use(express.json());





app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // ✅ Session per user alag hoga
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 } // 1 hour session
}));

app.options('*', cors()); // allow preflight for all route

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
const Attendance = require('./models/attendancewala/userRoutes')

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected 🟢🟢"))
  .catch((err) => console.error(err));

// ✅ Public Routes (No Authentication Required)
app.use("", LoginSignup);
app.use("/", Contactus);
app.use("/", Attendance);

// ✅ Protected Routes (Authentication Required)
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


app.get('/', (req, res) => {
  res.status(404).send({ message: 'Backend live' })
})

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔴🔴`));
