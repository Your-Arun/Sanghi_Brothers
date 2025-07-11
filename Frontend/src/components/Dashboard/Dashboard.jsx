import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaTrash, FaUniversity, FaFolderOpen, FaWallet, FaComments } from "react-icons/fa";
import add from "/add.png";
import ProfileModal from "./profile";
import axiosInstance from './axiosInstance';
import UserContext from '../Home Page/UserContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [reportfile, setReportFile] = useState([]);
  const [cashier, setCashier] = useState([]);
  const [reports, setReports] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportfileRes, cashierRes, reportsRes] = await Promise.all([
          axiosInstance.get("/reportfile", { withCredentials: true }),
          axiosInstance.get("/cashier", { withCredentials: true }),
          axiosInstance.get("/reports", { withCredentials: true }),
        ]);
        setReportFile(reportfileRes.data);
        setCashier(cashierRes.data);
        setReports(reportsRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data.");
      }
    };
    fetchData();
  }, []);

  const confirmDelete = (onConfirm) => {
    toast(({ closeToast }) => (
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete?</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => { onConfirm(); closeToast(); }} className="px-3 py-1 bg-red-500 text-white rounded">Yes</button>
          <button onClick={closeToast} className="px-3 py-1 bg-gray-300 rounded">No</button>
        </div>
      </div>
    ), { autoClose: false, closeOnClick: false });
  };

  const deleteReport = (id) => confirmDelete(async () => {
    try {
      await axiosInstance.delete(`/reports/${id}`);
      setReports((prev) => prev.filter(r => r._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete");
    }
  });

  const openReport = (report) => setSelectedReport(report);
  const closeReportModal = () => setSelectedReport(null);

  const cards = [
    { title: "Report Files", icon: <FaFolderOpen className="text-4xl text-blue-500" />, count: reportfile.length, onAdd: () => navigate("/reportfile"), onView: () => setIsOpen3(true), items: reportfile, more: isOpen3, onCloseMore: () => setIsOpen3(false) },
    { title: "Cashier Work", icon: <FaWallet className="text-4xl text-green-500" />, count: cashier.length, onAdd: () => navigate("/cashier"), onView: () => setIsOpen(true), items: cashier, more: isOpen, onCloseMore: () => setIsOpen(false) },
    { title: "Complaints", icon: <FaComments className="text-4xl text-red-500" />, count: reports.length, onAdd: () => navigate("/report"), onView: () => setIsOpen2(true), items: reports, more: isOpen2, onCloseMore: () => setIsOpen2(false), isReport: true }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <img src="/user.png" alt="Profile" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => setProfileOpen(true)} />
        {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.title} className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div>{c.icon}</div>
              <div className="text-xl font-semibold">{c.title}</div>
              <img src={add} alt="Add" className="w-6 cursor-pointer" onClick={c.onAdd} />
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-3">
              {c.items.slice(0, 4).map((item) =>
                c.isReport ? (
                  <div key={item._id} onClick={() => openReport(item)} className="min-w-[180px] p-3 bg-gray-50 rounded shadow cursor-pointer">
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.department}</div>
                    <button onClick={(e) => { e.stopPropagation(); deleteReport(item._id); }} className="mt-2 text-red-500">Delete</button>
                  </div>
                ) : (
                  <div key={item._id} className="min-w-[180px] p-3 bg-gray-50 rounded shadow">
                    <div className="font-semibold">{c.title === "Cashier Work" ? `₹${item.amount}` : item.department}</div>
                    <div className="text-sm text-gray-600">{new Date(item.date || item.entryDate).toLocaleDateString()}</div>
                  </div>
                )
              )}
            </div>
            {c.count > 4 && <button onClick={c.onView} className="mt-3 text-blue-500">See All</button>}
            {/* Modal */}
            {c.more && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg relative overflow-auto max-h-[80vh]">
                  <button onClick={c.onCloseMore} className="absolute top-3 right-3"><FaTimes /></button>
                  <h2 className="text-2xl font-semibold mb-4">{c.title}</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {c.items.map((item) => (
                      <div key={item._id} className="bg-gray-50 p-3 rounded">
                        {c.isReport ? (
                          <>
                            <div className="font-bold">{item.title}</div>
                            <div className="text-gray-600">{item.department}</div>
                            <button onClick={() => deleteReport(item._id)} className="mt-2 text-red-500">Delete</button>
                          </>
                        ) : (
                          <>
                            <div className="font-semibold">{c.title === "Cashier Work" ? `₹${item.amount}` : item.department}</div>
                            <div className="text-sm">{new Date(item.date || item.entryDate).toLocaleDateString()}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg relative">
            <button className="absolute top-3 right-3" onClick={closeReportModal}><FaTimes /></button>
            <h2 className="text-xl font-bold mb-2">{selectedReport.title}</h2>
            <p className="text-gray-700">{selectedReport.content}</p>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={closeReportModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
