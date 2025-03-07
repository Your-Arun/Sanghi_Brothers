const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();



app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // ✅ Allow credentials (cookies/sessions)
  })
);


app.use(cookieParser());
app.use(bodyparser.json());
app.use(express.json());

const FlowRoute = require('./routes/flowroutes');
const Monthlyfundflow = require('./routes/sbo3flow');
const PumpReport = require("./routes/pumproute");
const SalesManagementSheet = require("./routes/mastersheet/salemngemntroute");
const PurchaseManagement = require("./routes/mastersheet/purchaseroute");
const Lubricant = require("./routes/mastersheet/lubricantroute");
const TankLorryManagement = require('./routes/mastersheet/tanklorryroute')
const BPCLSTATUTORY = require('./routes/mastersheet/routebpclstatutory')
const Staffmng = require('./routes/mastersheet/staffroute')
const Financemng = require('./routes/mastersheet/financeroute')
const Lekha = require('./routes/routelekhajokha')
const ShiftingRoutes = require('./models/shifting/routesss');
const MeterClose = require('./routes/metercloseroute');
const Excelsheet = require('./routes/exceslsheetuploding')
const DepostRoute = require('./routes/depositRoutes')
const CashSlip = require('./routes/cashsliproute')
const Contactus = require('./routes/contactus')
const LoginSignup = require('./routes/loginsignup')
const User = require('./models/user')
const ReporFile = require('./routes/reportfileroute')
const FundPosition = require('./routes/fundposition')
const ReportComplaint = require('./routes/reportcomlaint')

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI,)
  .then(() => console.log("MongoDB connected 🟢🟢"))
  .catch((err) => console.error(err));


//signup & login
app.use('', LoginSignup)



//save flow data
app.use('/bank', FlowRoute);
//saving monthly flow fund data
app.use('/bank', Monthlyfundflow);
//mastersheet calling
app.use('/mastersheet', PumpReport);
app.use('/mastersheet', SalesManagementSheet);
app.use('/mastersheet', PurchaseManagement);
app.use('/mastersheet', Lubricant);
app.use('/mastersheet', TankLorryManagement);
app.use('/mastersheet', BPCLSTATUTORY);
app.use('/mastersheet', Staffmng);
app.use('/mastersheet', Financemng);
app.use('/newlekhajokha', Lekha);
app.use('', MeterClose);
app.use('', Contactus);
//reportfile 
app.use('', ReporFile)
//excelsheet uploading filess routes
app.use('', Excelsheet);
app.use('', DepostRoute)
app.use('', CashSlip)
//fundposition
app.use('', FundPosition);

// Middleware to Verify JWT


//complaint report 
app.use('',ReportComplaint)


// Retrieve Data from MongoDB
app.use('/shifting', ShiftingRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}🔴🔴`));
