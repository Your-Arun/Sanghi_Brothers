import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Report from "./components/Layouts/Report";
import ReportFile from "./components/Layouts/ReportFile";
import UpdateReportFile from "./components/updated_Report/UpdateReportFile";
import DepartmentReports from "./components/Layouts/DepartmentReport";
import ForgotPassword from "./components/Home Page/ForgetPassword";
import Sb01 from "./components/Layouts/Sb01";
import SBI01Update from "./components/updated_Report/SBI01Update";
import InFlowOutFlow from "./components/Layouts/InFlowOutFlow";
import InOutFlowUpdate from "./components/updated_Report/InOutFlowUpdate";
import ContactUs from "./components/Home Page/ContactUs";
import Navbar from "./components/Home Page/Navbar";
import Services from "./components/Home Page/ServicesPage";
import AboutUs from "./components/Home Page/AboutsUs";
import Home from "./components/Home Page/Home";
import Signup from "./components/Home Page/Signup";
import Login from "./components/Home Page/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import SB03_Monthly from "./components/Layouts/SB03_Monthly";
import Sb03Update from "./components/updated_Report/sb03update";
import Mergesb01Inflo from "./components/Layouts/Mergesb01Inflo";
import MasterChecklist from "./components/Layouts/MasterChecklist";
import ChekList from "./components/Layouts/ChekList";
import SalesManagement from "./components/Layouts/salesMangemnesheet";
import UpdatePumpSheet from "./components/updated_Report/updatepumpsheet";
import ShiftingProgram from "./components/Layouts/ShiftingProgram";
import UpdatesalesManagement from "./components/updated_Report/updatesalemanagemnet";
import PurchaseMngmnt from "./components/Layouts/purchasemngment"
import UpdatePurchase from "./components/updated_Report/updatepurchase"
import LubricantMangement from "./components/Layouts/Lubricant";
import LubricantUpdate from './components/updated_Report/Lubricantupdate'
import TankLorry from './components/Layouts/TanklorryMngemnt'
import LorryUpdate from './components/updated_Report/lorryupdate'








const App = () => {
  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  );
};

const AppContent = () => {
  const location = useLocation(); // Get the current route location

  // Define routes where the Navbar should be shown
  const showNavbarRoutes = ["/", "/contact/contactus", "/services", "/about"];

  // Check if the current route is in the showNavbarRoutes array
  const shouldShowNavbar = showNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact/contactus" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/reportfile" element={<ReportFile />} />
        <Route path="/reportfile/:id" element={<UpdateReportFile />} />
        <Route path="/department-reports" element={<DepartmentReports />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/fundposition" element={<Sb01 />} />
        <Route path="/fundposition/:id" element={<SBI01Update />} />
        <Route path="/bank/monthlyflow" element={<InFlowOutFlow />} />
        <Route path="/bank/monthlyflow/:id" element={<InOutFlowUpdate />} />
        <Route path="/bank/monthlyfundflow" element={<SB03_Monthly />} />
        <Route path="/bank/monthlyfundflow/:id" element={<Sb03Update />} />
        <Route path="/sbbank" element={<Mergesb01Inflo />} />
        <Route path="/mastersheet" element={<ChekList />} />
        <Route path="/mastersheet/pumpsheet" element={<MasterChecklist/>} />
        <Route path="/mastersheet/pumpsheet/:id" element={<UpdatePumpSheet/>} />
        <Route path="/shifting" element={<ShiftingProgram/>} />
        <Route path="/mastersheet/salesmanagementsheet" element={<SalesManagement/>} />
        <Route path="/mastersheet/salesmanagementsheet/:id" element={<UpdatesalesManagement/>} />
        <Route path="/mastersheet/purchasemanagement" element={<PurchaseMngmnt/>} />
        <Route path="/mastersheet/purchasemanagement/:id" element={<UpdatePurchase/>} />
        <Route path="/mastersheet/lubricantmanagement" element={<LubricantMangement/>} />
        <Route path="/mastersheet/lubricantmanagement/:id" element={<LubricantUpdate/>} />
        <Route path="/mastersheet/tanklorry" element={<TankLorry/>} />
        <Route path="/mastersheet/tanklorry/:id" element={<LorryUpdate/>} />

      </Routes>
    </>
  );
};

export default App;