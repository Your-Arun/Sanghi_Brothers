import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaFolderOpen, FaWallet, FaComments, FaUniversity } from "react-icons/fa";
import add from "/add.png";
import ProfileModal from "./profile";
import axiosInstance from './axiosInstance';
import UserContext from '../Home Page/UserContext';
import { toast } from 'react-toastify';

const UpdateDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportfile, setReportFile] = useState([]);
  const [cashier, setCashier] = useState([]);
  const [bankReport, setBankReport] = useState([]);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [departmentRes, reportRes, cashierRes, reportfileRes, bankRes] = await Promise.all([
          axiosInstance.get("/departments", { withCredentials: true }),
          axiosInstance.get("/reports", { withCredentials: true }),
          axiosInstance.get("/cashier", { withCredentials: true }),
          axiosInstance.get("/reportfile", { withCredentials: true }),
          axiosInstance.get("/bank/monthlyfundflow", { withCredentials: true }),
        ]);

        setDepartments(departmentRes.data);
        setReports(reportRes.data);
        setCashier(cashierRes.data);
        setReportFile(reportfileRes.data);
        setBankReport(bankRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to fetch dashboard data.");
      }
    };
    fetchAll();
  }, []);

  const viewReports = (department) => {
    if (!user || !user.department) {
      toast.error("Access denied.");
      return;
    }
    const userDept = user.department.toLowerCase();
    const targetDept = department.toLowerCase();
  
    if (userDept === "manager" || userDept === targetDept) {
      navigate(`/department-reports?department=${department}`);
    } else {
      toast.error("Not authorized for this department.");
    }
  };
  

  const cards = [
    {
        title: "Departments",
        icon: <FaUniversity className="text-4xl text-purple-500" />,
        count: departments.length,
        onAdd: null,
        onView: () => setActiveModal("departments"),
        items: departments,
        more: activeModal === "departments",
        renderItem: (item) => (
          <div
            key={item._id}
            onClick={() => viewReports(item.name)}
            className="min-w-[180px] p-3 bg-yellow-100 rounded shadow cursor-pointer hover:bg-yellow-200 transition-all duration-300 text-center"
          >
            <div className="font-semibold text-indigo-700 uppercase">{item.name}</div>
          </div>
      ),
    },
    {
      title: "Bank Reports",
      icon: <FaFolderOpen className="text-4xl text-red-500" />,
      count: bankReport.length,
      onAdd: () => navigate("/bankreport"),
      onView: () => setActiveModal("bank"),
      items: bankReport,
      more: activeModal === "bank",
      renderItem: (item) => (
        <div key={item._id} className="min-w-[180px] p-3 bg-gray-50 rounded shadow">
          <div className="font-bold text-green-700">₹{item.amount}</div>
          <div className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      title: "Report Files",
      icon: <FaFolderOpen className="text-4xl text-blue-500" />,
      count: reportfile.length,
      onAdd: () => navigate("/reportfile"),
      onView: () => setActiveModal("reportfile"),
      items: reportfile,
      more: activeModal === "reportfile",
      renderItem: (item) => (
        <div key={item._id} className="min-w-[180px] p-3 bg-gray-50 rounded shadow">
          <div className="font-bold text-green-700">{item.department}</div>
          <div className="text-sm text-gray-600">{new Date(item.entryDate).toLocaleDateString()}</div>
          <div className="text-sm">Cash Sales: ₹{item.reports.cashsales}</div>
        </div>
      ),
    },
    {
      title: "Cashier Work",
      icon: <FaWallet className="text-4xl text-green-500" />,
      count: cashier.length,
      onAdd: () => navigate("/cashier"),
      onView: () => setActiveModal("cashier"),
      items: cashier,
      more: activeModal === "cashier",
      renderItem: (item) => (
        <div key={item._id} className="min-w-[180px] p-3 bg-gray-50 rounded shadow">
          <div className="font-bold">₹{item.amount}</div>
          <div className="text-sm text-gray-600">{item.bank}</div>
          <div className="text-sm">{new Date(item.date).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      title: "Complaints",
      icon: <FaComments className="text-4xl text-red-500" />,
      count: reports.length,
      onAdd: () => navigate("/report"),
      onView: () => setActiveModal("reports"),
      items: reports,
      more: activeModal === "reports",
      renderItem: (item) => (
        <div key={item._id} onClick={() => setSelectedReport(item)} className="min-w-[180px] p-3 bg-gray-50 rounded shadow cursor-pointer">
          <div className="font-bold">{item.title}</div>
          <div className="text-sm text-gray-600">{item.department}</div>
        </div>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <img
          src="/user.png"
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setProfileOpen(true)}
        />
        {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div>{card.icon}</div>
              <div className="text-xl font-semibold">{card.title}</div>
              {card.onAdd && (
                <img src={add} alt="Add" className="w-6 cursor-pointer" onClick={card.onAdd} />
              )}
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-3 scrollbar-hide">
              {card.items.slice(0, 4).map(card.renderItem)}
            </div>
            {card.count > 4 && (
              <button onClick={card.onView} className="mt-3 text-blue-500 hover:underline">
                See All
              </button>
            )}

            {/* Modal */}
            {card.more && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg relative overflow-auto max-h-[80vh]">
                  <button onClick={() => setActiveModal(null)} className="absolute top-3 right-3">
                    <FaTimes />
                  </button>
                  <h2 className="text-2xl font-semibold mb-4">{card.title}</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {card.items.map(card.renderItem)}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg relative">
            <button className="absolute top-3 right-3" onClick={() => setSelectedReport(null)}>
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedReport.title}</h2>
            <p className="text-gray-700">{selectedReport.content}</p>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={() => setSelectedReport(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateDashboard;
