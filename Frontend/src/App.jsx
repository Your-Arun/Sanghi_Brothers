import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { UserProvider } from "./components/Home Page/UserContext.jsx";
import "./index.css";
import Navbar from "./components/Home Page/Navbar";
import Home from "./components/Home Page/Home";
import ContactUs from "./components/Home Page/ContactUs";
import Services from "./components/Home Page/ServicesPage";
import AboutUs from "./components/Home Page/AboutsUs";
import ForgotPassword from "./components/Home Page/ForgetPassword";
import Dashboard from "./components/Dashboard/Dashboard";
import Staffmember from "./components/Dashboard/staff-member.jsx";
import Report from "./components/Layouts/Report";
import ReportFile from "./components/Layouts/ReportFile";
import UpdateReportFile from "./components/updated_Report/UpdateReportFile";
import DepartmentReports from "./components/Layouts/DepartmentReport";
import Sb01 from "./components/Layouts/Sb01";
import SBI01Update from "./components/updated_Report/SBI01Update";
import InFlowOutFlow from "./components/Layouts/InFlowOutFlow";
import InOutFlowUpdate from "./components/updated_Report/InOutFlowUpdate";
import SB03_Monthly from "./components/Layouts/SB03_Monthly";
import Sb03Update from "./components/updated_Report/sb03update";
import Mergesb01Inflo from "./components/Layouts/Mergesb01Inflo";
import MasterChecklist from "./components/Layouts/MasterChecklist";
import ChekList from "./components/Layouts/ChekList";
import SalesManagement from "./components/Layouts/salesMangemnesheet";
import UpdatePumpSheet from "./components/updated_Report/updatepumpsheet";
import ShiftingProgram from "./components/Layouts/ShiftingProgram";
import UpdatesalesManagement from "./components/updated_Report/updatesalemanagemnet";
import PurchaseMngmnt from "./components/Layouts/purchasemngment";
import UpdatePurchase from "./components/updated_Report/updatepurchase";
import LubricantMangement from "./components/Layouts/Lubricant";
import LubricantUpdate from './components/updated_Report/Lubricantupdate';
import TankLorry from './components/Layouts/TanklorryMngemnt';
import LorryUpdate from './components/updated_Report/lorryupdate';
import BPCLStatutory from './components/Layouts/Bpcl&Statuory';
import Updatebpcl from './components/updated_Report/updatebpclstatutory';
import Staffmngment from './components/Layouts/staffmngemnt';
import StaffUpdate from './components/updated_Report/updatestaff';
import Finance from './components/Layouts/financemgnemnt';
import UpdateFin from './components/updated_Report/updatefinance';
import Lekhajokha from './components/Layouts/lekhajokha';
import LekhaBox from './components/Layouts/LekhaBox';
import Lekhajokhaupdate from './components/updated_Report/lekhajokhaupdate';
import ExcelUploader from './components/excelsheet/exceluploader';
import MeterClose from './components/Petrol Related/Meterclose';
import MeterBox from './components/Petrol Related/meterclosebox';
import UpdateMeter from './components/Petrol Related/updatemeterclose';
import Cashier from "./components/Layouts/cashier";
import CashSlip from "./components/Layouts/cashslip";
import MergingSbSection from './components/Dashboard/sbbankk/mergingsbsection.jsx';
import ProtectedRoute from "./components/Dashboard/ProtectedRoute.jsx";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from "./components/Dashboard/adminPanel.jsx";
import AllShifts from "./components/Dashboard/ShiftDisplay.jsx";
import SessionTimeout from "./components/Home Page/SessionTimeout.jsx";
import Notfound from "./components/Layouts/NotFound";
import AttendancePage from "./components/AttendanceSheet/AttendancePage.jsx";
import DailyLogView from "./components/AttendanceSheet/DailyLogView.jsx";
import CreateUserPage from "./components/AttendanceSheet/CreateUserModal.jsx";






const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <UserProvider>
        <Router>
          <SessionTimeout timeout={240 * 60 * 1000} /> {/* 10 min session timeout */}
          <AppContent />
        </Router>
      </UserProvider>
    </>
  );
};


const AppContent = () => {
  const location = useLocation();
  // ✅ Show Navbar Only on These Routes
  const showNavbarRoutes = ["/", "/contacts", "/services", "/about", "/login", "/signup"];
  const shouldShowNavbar = showNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="*" element={<Notfound />} />
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contacts" element={<ContactUs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/dashb" element={< Dashboarddd/>} /> */}
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/staff-dashboard" element={<Staffmember />} />
          <Route path="/bankreport" element={<MergingSbSection />} />
          <Route path="/sbbank" element={<Mergesb01Inflo />} />
          <Route path="/fundposition" element={<Sb01 />} />
          <Route path="/fundposition/:id" element={<SBI01Update />} />
          <Route path="/bank/monthlyflow" element={<InFlowOutFlow />} />
          <Route path="/bank/monthlyflow/:id" element={<InOutFlowUpdate />} />
          <Route path="/bank/monthlyfundflow" element={<SB03_Monthly />} />
          <Route path="/bank/monthlyfundflow/:id" element={<Sb03Update />} />
          <Route path="/mastersheet" element={<ChekList />} />
          <Route path="/mastersheet/pumpsheet" element={<MasterChecklist />} />
          <Route path="/mastersheet/pumpsheet/:id" element={<UpdatePumpSheet />} />
          <Route path="/mastersheet/salesmanagementsheet" element={<SalesManagement />} />
          <Route path="/mastersheet/salesmanagementsheet/:id" element={<UpdatesalesManagement />} />
          <Route path="/mastersheet/purchasemanagement" element={<PurchaseMngmnt />} />
          <Route path="/mastersheet/purchasemanagement/:id" element={<UpdatePurchase />} />
          <Route path="/mastersheet/lubricantmanagement" element={<LubricantMangement />} />
          <Route path="/mastersheet/lubricantmanagement/:id" element={<LubricantUpdate />} />
          <Route path="/mastersheet/tanklorry" element={<TankLorry />} />
          <Route path="/mastersheet/tanklorry/:id" element={<LorryUpdate />} />
          <Route path="/mastersheet/bpcl&statutory" element={<BPCLStatutory />} />
          <Route path="/mastersheet/bpcl&statutory/:id" element={<Updatebpcl />} />
          <Route path="/mastersheet/staffmanagement" element={<Staffmngment />} />
          <Route path="/mastersheet/staffmanagement/:id" element={<StaffUpdate />} />
          <Route path="/mastersheet/finance" element={<Finance />} />
          <Route path="/mastersheet/finance/:id" element={<UpdateFin />} />
          <Route path="/reportfile" element={<ReportFile />} />
          <Route path="/reportfile/:id" element={<UpdateReportFile />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/report" element={<Report />} />
          <Route path="/department-reports" element={<DepartmentReports />} />
          <Route path="/shifting" element={<ShiftingProgram />} />
          <Route path="/allshifting" element={<AllShifts />} />
          <Route path="/lekhajokha" element={<LekhaBox />} />
          <Route path="/newlekhajokha" element={<Lekhajokha />} />
          <Route path="/newlekhajokha/:id" element={<Lekhajokhaupdate />} />
          <Route path="/exceluploader" element={<ExcelUploader />} />
          <Route path="/createmeterclose" element={<MeterBox />} />
          <Route path="/meterclose" element={<MeterClose />} />
          <Route path="/meterclose/:id" element={<UpdateMeter />} />
          <Route path="/Cashslip" element={<CashSlip />} />
          <Route path="/attendance-sheet" element={<AttendancePage />} />
          <Route path="/daily-log-view" element={<DailyLogView />} />
          <Route path="/create-user" element={<CreateUserPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
