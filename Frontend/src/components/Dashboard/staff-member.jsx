import React, { useState, useEffect, useContext } from "react";
import {
  FaMoneyBill,
  FaTruck,
  FaExclamationTriangle,
  FaUser,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaPlus,
  FaChevronRight,
  FaGasPump
} from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsOpencollective } from "react-icons/bs";
import ProfileModal from "./profile";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext";
import ShiftComponent from "../Dashboard/Shift Component";

const StaffDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [cashslip, setCashslip] = useState([]);
  const [lekha, setLekha] = useState([]);
  const [salepytm, setSalepytm] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- FILTERS ---
  const [filter, setFilter] = useState("today");
  const [customDate, setCustomDate] = useState("");

  // Helpers
  const formatDate = (dateString) => new Date(dateString).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  const filteredSlips =
    filter === "today"
      ? cashslip.filter((s) => formatDate(s.date) === today)
      : filter === "other"
      ? cashslip.filter((s) => formatDate(s.date) !== today)
      : filter === "custom" && customDate
      ? cashslip.filter((s) => formatDate(s.date) === customDate)
      : cashslip;

  // --- EFFECTS ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/profile", { withCredentials: true });
        if (data?.user) setUser(data.user);
        else throw new Error("Session expired");
      } catch (err) {
        toast.error("Session expired. Please log in again.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentRes, reportRes, cashierRes, lekhajokha, salepytmm] =
          await Promise.all([
            axiosInstance.get("/departments", { withCredentials: true }),
            axiosInstance.get("/reports", { withCredentials: true }),
            axiosInstance.get("/Cashslip", { withCredentials: true }),
            axiosInstance.get("/newlekhajokha", { withCredentials: true }),
            axiosInstance.get("/salepaytm", { withCredentials: true }),
          ]);
        setDepartments(departmentRes.data);
        setReports(reportRes.data);
        setCashslip(cashierRes.data);
        setLekha(lekhajokha.data);
        setSalepytm(salepytmm.data);
      } catch {
        toast.warning("Failed to fetch data.");
      }
    };
    fetchData();
  }, []);

  const openReportPage = () => {
    if (!selectedDepartment) return toast.warn("Please select a department!");
    navigate(`/report?department=${selectedDepartment}`);
    setShowModal2(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
    { id: "cashslip", label: "Cash Slip", icon: <FaMoneyBill /> },
    { id: "shifting", label: "Shifting", icon: <FaTruck /> },
    { id: "complaint", label: "Complaints", icon: <FaExclamationTriangle /> },
    { id: "lekhajokha", label: "Lekha Jokha", icon: <BsOpencollective /> },
    { id: "salepytm", label: "Sale & Paytm", icon: <IoIosAlert /> },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen text-blue-600">Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* --- SIDEBAR (Desktop) & DRAWER (Mobile) --- */}
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-xl flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-wide text-blue-400">STAFF PANEL</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <FaTimes size={20}/>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
                navigate(`?tab=${item.id}`);
              }}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 font-medium text-sm ${
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition font-medium text-sm"
          >
            <FaUser /> <span>My Profile</span>
          </button>
        </div>
      </aside>


      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center z-20">
          <h1 className="text-lg font-bold text-gray-800 uppercase">{activeTab.replace('_', ' ')}</h1>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100"
          >
            <FaBars size={20} />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          
          {/* Welcome Message (Only on Dashboard) */}
          {activeTab === "dashboard" && (
            <div className="mb-8">
               <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                 Welcome back, <span className="text-blue-600">{user.username}</span> 👋
               </h1>
               <p className="text-gray-500 mt-1">Here is what's happening today.</p>
            </div>
          )}

          {/* ---------------- DASHBOARD TAB ---------------- */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  title: "Cash Slips", 
                  count: cashslip?.length || 0, 
                  icon: <FaMoneyBill />, 
                  color: "bg-blue-500", 
                  bg: "bg-blue-50",
                  text: "text-blue-600",
                  target: "cashslip" 
                },
                { 
                  title: "Complaints", 
                  count: reports?.length || 0, 
                  icon: <FaExclamationTriangle />, 
                  color: "bg-red-500", 
                  bg: "bg-red-50",
                  text: "text-red-600",
                  target: "complaint"
                },
                { 
                  title: "Lekha Jokha", 
                  count: lekha?.length || 0, 
                  icon: <BsOpencollective />, 
                  color: "bg-emerald-500", 
                  bg: "bg-emerald-50",
                  text: "text-emerald-600",
                  target: "lekhajokha"
                },
              ].map((card, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setActiveTab(card.target); navigate(`?tab=${card.target}`); }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer group"
                >
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-gray-500 font-medium text-sm">{card.title}</p>
                         <h3 className="text-3xl font-bold text-gray-800 mt-2">{card.count}</h3>
                      </div>
                      <div className={`p-3 rounded-xl ${card.bg} ${card.text} group-hover:scale-110 transition-transform`}>
                        {card.icon}
                      </div>
                   </div>
                   <div className="mt-4 flex items-center text-sm text-gray-400 font-medium group-hover:text-gray-600 transition">
                      View Details <FaChevronRight className="ml-1 text-xs" />
                   </div>
                </div>
              ))}
            </div>
          )}

          {/* ---------------- CASH SLIP TAB ---------------- */}
          {activeTab === "cashslip" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                   <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><FaMoneyBill /></div>
                   <h2 className="text-xl font-bold text-gray-800">Cash Slips</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button onClick={() => setFilter('today')} className={`px-3 py-1 text-sm rounded-md transition ${filter === 'today' ? 'bg-white shadow text-gray-800 font-medium' : 'text-gray-500'}`}>Today</button>
                        <button onClick={() => setFilter('other')} className={`px-3 py-1 text-sm rounded-md transition ${filter === 'other' ? 'bg-white shadow text-gray-800 font-medium' : 'text-gray-500'}`}>History</button>
                        <button onClick={() => setFilter('custom')} className={`px-3 py-1 text-sm rounded-md transition ${filter === 'custom' ? 'bg-white shadow text-gray-800 font-medium' : 'text-gray-500'}`}>Custom</button>
                    </div>
                    {filter === "custom" && (
                        <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none focus:border-blue-500" />
                    )}
                    <button onClick={() => navigate("/Cashslip")} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        <FaPlus size={12} /> New Slip
                    </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {filteredSlips.length > 0 ? (
                    filteredSlips.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-blue-200 transition">
                         <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-3">
                            <div>
                               <h3 className="font-bold text-gray-800">{item.name}</h3>
                               <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <FaCalendarAlt size={10} /> {new Date(item.date).toLocaleDateString("en-GB")}
                               </span>
                            </div>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase">{item.shift}</span>
                         </div>
                         <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between"><span>Nozzle:</span> <span className="font-medium">{item.nozzleNo}</span></div>
                            <div className="flex justify-between"><span>Sales (Ltr):</span> <span className="font-medium">{item.salesInLtr}</span></div>
                            <div className="flex justify-between"><span>Readings:</span> <span className="text-xs">{item.openingReading} ➝ {item.closingReading}</span></div>
                         </div>
                         <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Total Amount</span>
                            <span className="text-lg font-bold text-green-600">₹{item.total.toLocaleString()}</span>
                         </div>
                      </div>
                    ))
                 ) : (
                    <div className="col-span-full py-12 text-center text-gray-400">No cash slips found for this selection.</div>
                 )}
              </div>
            </div>
          )}

          {/* ---------------- COMPLAINTS TAB ---------------- */}
          {activeTab === "complaint" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                 <div className="flex items-center gap-2">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600"><FaExclamationTriangle /></div>
                    <h2 className="text-xl font-bold text-gray-800">Complaints</h2>
                 </div>
                 <button onClick={() => navigate("/report")} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2">
                    <FaPlus size={12} /> Raise Issue
                 </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {reports.map((report) => (
                    <div key={report._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                       <h3 className="font-bold text-gray-800 mb-1">{report.title}</h3>
                       <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{report.department}</span>
                       <p className="text-sm text-gray-500 mt-3 line-clamp-2">{report.description || "No description provided."}</p>
                    </div>
                 ))}
                 {reports.length === 0 && <div className="col-span-full text-center text-gray-400 py-10">No active complaints.</div>}
              </div>
            </div>
          )}

          {/* ---------------- SHIFTING TAB ---------------- */}
          {activeTab === "shifting" && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-6">
                   <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><FaTruck /></div>
                   <h2 className="text-xl font-bold text-gray-800">Shifting Arrangement</h2>
                </div>
                <ShiftComponent />
             </div>
          )}

          {/* ---------------- LEKHA JOKHA TAB ---------------- */}
          {activeTab === "lekhajokha" && (
             <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600"><BsOpencollective /></div>
                        <h2 className="text-xl font-bold text-gray-800">Lekha Jokha</h2>
                    </div>
                    <button onClick={() => navigate("/newlekhajokha")} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2">
                        <FaPlus size={12} /> Add Entry
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {lekha.map((item, i) => (
                       <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center hover:border-green-200 transition">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-600 font-bold text-lg">
                             {item.username?.charAt(0)}
                          </div>
                          <h3 className="font-bold text-gray-800">{item.username}</h3>
                          <p className="text-green-600 text-sm font-medium mt-1">{item.department}</p>
                          <p className="text-gray-400 text-xs mt-2">{new Date(item.date).toLocaleDateString("en-GB")}</p>
                       </div>
                    ))}
                </div>
             </div>
          )}

          {/* ---------------- SALE & PAYTM TAB ---------------- */}
          {activeTab === "salepytm" && (
             <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><IoIosAlert size={20}/></div>
                        <h2 className="text-xl font-bold text-gray-800">Sale & Paytm</h2>
                    </div>
                    <button onClick={() => navigate("/salepytm")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2">
                        <FaPlus size={12} /> Add Entry
                    </button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-700 pl-1">Recent Entries</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                   {salepytm.slice(0, 9).map((entry) => (
                      <div key={entry._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                         <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{new Date(entry.date).toLocaleDateString()}</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-bold text-gray-700">{entry.shift}</span>
                         </div>
                         <div className="p-4 space-y-3">
                            {entry.rows.map((r, idx) => (
                               <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-1 last:pb-0">
                                  <div className="flex items-center gap-2 text-gray-600">
                                     <FaGasPump className="text-gray-300 text-xs"/>
                                     <span className="font-medium">{r.name || "Nozzle " + (idx+1)}</span>
                                  </div>
                                  <div className="flex gap-3 text-xs">
                                     <span className="text-green-600 font-semibold bg-green-50 px-1.5 rounded">{r.sale || 0} L</span>
                                     <span className="text-indigo-600 font-semibold bg-indigo-50 px-1.5 rounded">₹{r.paytm || 0}</span>
                                  </div>
                               </div>
                            ))}
                         </div>
                         <div className="bg-indigo-50 px-4 py-3 flex justify-between items-center text-sm border-t border-indigo-100">
                             <span className="text-indigo-800 font-medium">Total Sales</span>
                             <div className="text-right">
                                <div className="font-bold text-gray-800">{entry.totalSale} L</div>
                                <div className="font-bold text-indigo-600">₹{entry.totalPaytm}</div>
                             </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

        </main>
      </div>

      {/* --- MODALS --- */}
      {showModal2 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm relative transform transition-all">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-black" onClick={() => setShowModal2(false)}>
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Select Department</h2>
            <select
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="" disabled>-- Choose --</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition" onClick={() => setShowModal2(false)}>Cancel</button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow" onClick={openReportPage}>Proceed</button>
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
    </div>
  );
};

export default StaffDashboard;