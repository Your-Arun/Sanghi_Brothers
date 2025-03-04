import React, { useState } from "react";
import { FaMoneyBill, FaTruck, FaExclamationTriangle, FaUser } from "react-icons/fa";
import ProfileModal from "./profile"; // Import profile modal

const Staffmember = () => {
  const [activeTab, setActiveTab] = useState("cashslip");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">Staff Dashboard</h2>
        <nav className="space-y-3">
          <button onClick={() => setActiveTab("cashslip")} className={`flex items-center gap-2 p-3 w-full rounded-lg ${activeTab === "cashslip" ? "bg-blue-700" : "hover:bg-blue-500"}`}>
            <FaMoneyBill /> Cash Slip
          </button>
          <button onClick={() => setActiveTab("shifting")} className={`flex items-center gap-2 p-3 w-full rounded-lg ${activeTab === "shifting" ? "bg-blue-700" : "hover:bg-blue-500"}`}>
            <FaTruck /> Shifting Arrangement
          </button>
          <button onClick={() => setActiveTab("complaint")} className={`flex items-center gap-2 p-3 w-full rounded-lg ${activeTab === "complaint" ? "bg-blue-700" : "hover:bg-blue-500"}`}>
            <FaExclamationTriangle /> Complaints
          </button>
          <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 p-3 w-full bg-blue-700 rounded-lg hover:bg-blue-500">
            <FaUser /> Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "cashslip" && <div className="bg-white p-6 rounded-lg shadow-md">Cash Slip Section</div>}
        {activeTab === "shifting" && <div className="bg-white p-6 rounded-lg shadow-md">Shifting Arrangement Section</div>}
        {activeTab === "complaint" && <div className="bg-white p-6 rounded-lg shadow-md">Complaint Management Section</div>}
      </main>

      {/* Profile Modal */}
      {isProfileOpen && <ProfileModal closeModal={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default Staffmember;
