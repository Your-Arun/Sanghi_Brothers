import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaTimes,
    FaFolderOpen,
    FaWallet,
    FaTrash,
    FaComments,
    FaUniversity,
    FaPlus,
    FaArrowRight,
    FaFileInvoiceDollar,
    FaUserClock,
    FaExchangeAlt,
    FaCloudUploadAlt,
    FaLock,
    FaMoneyBillWave
} from "react-icons/fa";
import ProfileModal from "./profile";
import axiosInstance from "./axiosInstance";
import UserContext from "../Home Page/UserContext";
import { toast } from "react-toastify";

const UpdateDashboard = () => {
    // --- STATE MANAGEMENT (Kept original logic) ---
    const [reports, setReports] = useState([]);
    const [reportfile, setReportFile] = useState([]);
    const [cashier, setCashier] = useState([]);
    const [bankReport, setBankReport] = useState([]);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [fundposition, setFundPosition] = useState([]);
    const [inOutFlow, setInOutFlow] = useState([]);
    const [masterSheet, setMasterSheet] = useState([]);
    const [cashierTotal, setCashierTotal] = useState(0);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // --- EFFECTS ---
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [
                    reportRes,
                    cashierRes,
                    reportfileRes,
                    bankRes,
                    fundRes,
                    flowRes,
                    masterRes,
                ] = await Promise.all([
                    axiosInstance.get("/reports"),
                    axiosInstance.get("/cashier"),
                    axiosInstance.get("/reportfile"),
                    axiosInstance.get("/bank/monthlyfundflow"),
                    axiosInstance.get("/fundposition"),
                    axiosInstance.get("/bank/monthlyflow"),
                    axiosInstance.get("/mastersheet/finance"),
                ]);

                setReports(reportRes.data);
                setCashier(cashierRes.data);
                setReportFile(reportfileRes.data);
                setBankReport(bankRes.data);
                setFundPosition(fundRes.data);
                setInOutFlow(flowRes.data);
                setMasterSheet(masterRes.data);

                const total = cashierRes.data.reduce((sum, item) => sum + item.amount, 0);
                setCashierTotal(total);
            } catch (err) {
                toast.error("Failed to fetch dashboard data.");
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            try {
                if (user?._id) {
                    const res = await axiosInstance.get(`/users/${user._id}/photo`);
                    setProfilePhoto(res.data.photo);
                }
            } catch (err) {
                console.error("Error fetching profile photo:", err);
            }
        };
        fetchProfilePhoto();
    }, [user]);

    // --- HANDLERS ---
    const viewReports = (department) => {
        if (!user || !user.department) {
            toast.error("Access denied.");
            return;
        }
        const userDept = user.department.toLowerCase();
        const departmentNormalized = department.toLowerCase();

        if (userDept === "manager" || userDept === departmentNormalized) {
            navigate(`/department-reports?department=${department}`);
        } else {
            toast.error("Not authorized for this department.");
        }
    };

    const bankItems = [
        ...bankReport.map((item) => ({ ...item, type: "SB Bank Report" })),
        ...fundposition.map((item) => ({ ...item, type: "Fund Position" })),
        ...inOutFlow.map((item) => ({ ...item, type: "In-Out Flow" })),
        ...masterSheet.map((item) => ({ ...item, type: "Master Checklist" }))
    ];

    const handleBankItemClick = (item) => {
        switch (item.type) {
            case "SB Bank Report": navigate(`/bank/monthlyfundflow/${item._id}`); break;
            case "Fund Position": navigate(`/fundposition/${item._id}`); break;
            case "In-Out Flow": navigate(`/bank/monthlyflow/${item._id}`); break;
            case "Master Checklist": navigate(`/mastersheet/finance/${item._id}`); break;
            default: toast.error("Invalid report type");
        }
    };

    const handleDeleteReport = async (reportId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this?");
        if (confirmDelete) {
            try {
                await axiosInstance.delete(`/reports/${reportId}`, { withCredentials: true });
                setReports((prev) => prev.filter((report) => report._id !== reportId));
                toast.success("Report deleted successfully!");
                setSelectedReport(null);
            } catch (error) {
                toast.error("Failed to delete report.");
            }
        }
    };

    // --- DASHBOARD CONFIGURATION ---
    const cards = [
        {
            title: "Bank Reports",
            icon: <FaUniversity className="text-white" />,
            bgColor: "bg-indigo-500",
            count: bankItems.length,
            onAdd: () => setActiveModal("bankOptions"),
            onView: () => setActiveModal("bank"),
            items: bankItems,
            more: activeModal === "bank",
            renderItem: (item, index) => (
                <div
                    key={item._id || index}
                    onClick={() => handleBankItemClick(item)}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer transition-colors"
                >
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-sm">{item.type}</span>
                        <span className="text-xs text-gray-500">
                            {new Date(item.createdAt || item.Date || item.dat2 || item.date).toLocaleDateString("en-GB")}
                        </span>
                    </div>
                    <FaArrowRight className="text-gray-300 text-xs" />
                </div>
            ),
        },
        {
            title: "Report Files",
            icon: <FaFolderOpen className="text-white" />,
            bgColor: "bg-blue-500",
            count: reportfile.length,
            onAdd: () => navigate("/reportfile"),
            onView: () => setActiveModal("reportfile"),
            items: reportfile,
            more: activeModal === "reportfile",
            renderItem: (item) => (
                <div
                    key={item._id}
                    onClick={() => navigate(`/reportfile/${item._id}`)}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer transition-colors"
                >
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-sm">Cash Sales</span>
                        <span className="text-xs text-green-600 font-semibold">₹ {item.reports.cashsales}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                        {new Date(item.entryDate).toLocaleDateString()}
                    </span>
                </div>
            ),
        },
        {
            title: "Cashier Work",
            icon: <FaWallet className="text-white" />,
            bgColor: "bg-emerald-500",
            count: cashier.length,
            totalLabel: `Total: ₹${cashierTotal.toLocaleString("en-IN")}`,
            onAdd: () => navigate("/cashier"),
            onView: () => setActiveModal("cashier"),
            items: cashier,
            more: activeModal === "cashier",
            renderItem: (item) => (
                <div key={item._id} className="flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-0">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">₹{item.amount}</span>
                        <span className="text-xs text-gray-500">{item.bank}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                </div>
            ),
        },
        {
            title: "Complaints",
            icon: <FaComments className="text-white" />,
            bgColor: "bg-red-500",
            count: reports.length,
            onAdd: () => navigate("/report"),
            onView: () => setActiveModal("reports"),
            items: reports,
            more: activeModal === "reports",
            renderItem: (item) => (
                <div
                    key={item._id}
                    onClick={() => setSelectedReport(item)}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer transition-colors"
                >
                    <div className="flex flex-col truncate w-4/5">
                        <span className="font-medium text-gray-800 text-sm truncate">{item.title}</span>
                        <span className="text-xs text-gray-500">{item.department}</span>
                    </div>
                </div>
            ),
        },
    ];

    const quickActions = [
        { label: "Shifting", icon: <FaExchangeAlt />, color: "bg-orange-500", path: "/shifting" },
        { label: "Lekha Jokha", icon: <FaFileInvoiceDollar />, color: "bg-indigo-500", path: "/lekhajokha" },
        { label: "Upload File", icon: <FaCloudUploadAlt />, color: "bg-blue-600", path: "/exceluploader" },
        { label: "Meter Close", icon: <FaLock />, color: "bg-purple-600", path: "/createmeterclose" },
        { label: "Cash Slip", icon: <FaMoneyBillWave />, color: "bg-teal-600", path: "/Cashslip" },
        { label: "Attendance", icon: <FaUserClock />, color: "bg-green-600", path: "/attendance-sheet" },
        { label: "Daily Sales", icon: <FaWallet />, color: "bg-rose-600", path: "/allsalepaytm" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* --- HEADER --- */}
            <nav className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            Dashboard
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-sm font-medium text-gray-600">
                                {user?.name || "User"}
                            </span>
                            <div className="relative">
                                <img
                                    src={profilePhoto || "/user.png"}
                                    alt="Profile"
                                    onClick={() => setProfileOpen(true)}
                                    className="h-10 w-10 rounded-full object-cover border-2 border-indigo-100 cursor-pointer hover:shadow-md transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* --- DEPARTMENT FILTERS --- */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-700">Departments</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {["Manager", "Accounts/Finance", "Backoffice"].map((name) => (
                            <button
                                key={name}
                                onClick={() => viewReports(name)}
                                className="flex-shrink-0 px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all whitespace-nowrap"
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- QUICK ACTIONS --- */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-700">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => navigate(action.path)}
                                className={`${action.color} text-white p-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-2`}
                            >
                                <div className="text-xl">{action.icon}</div>
                                <span className="text-xs font-semibold tracking-wide">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- MAIN CARDS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {cards.map((card, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                            {/* Card Header */}
                            <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                                <div className="flex gap-4 items-center">
                                    <div className={`p-3 rounded-lg shadow-sm ${card.bgColor}`}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-gray-900 font-bold text-lg">{card.title}</h3>
                                        <p className="text-gray-500 text-xs font-medium">{card.count} Items</p>
                                    </div>
                                </div>
                                {card.onAdd && (
                                    <button 
                                        onClick={card.onAdd}
                                        className="text-gray-400 hover:text-indigo-600 p-1 bg-gray-50 rounded-full hover:bg-indigo-50 transition-colors"
                                    >
                                        <FaPlus />
                                    </button>
                                )}
                            </div>

                            {/* Card Content (List) */}
                            <div className="flex-1 overflow-y-auto max-h-[220px]">
                                {card.extraContent && (
                                    <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-xs font-bold text-center border-b border-yellow-100">
                                        {card.extraContent || card.totalLabel}
                                    </div>
                                )}
                                {card.items.length > 0 ? (
                                    card.items.slice(0, 4).map((item, i) => card.renderItem(item, i))
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-400 italic">No data available</div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                                <button 
                                    onClick={card.onView}
                                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 w-full"
                                >
                                    View All
                                </button>
                            </div>

                            {/* --- FULL LIST MODAL --- */}
                            {card.more && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
                                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                                            <h3 className="font-bold text-lg text-gray-800">{card.title}</h3>
                                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <div className="overflow-y-auto p-4 space-y-2">
                                            {card.items.map((item, i) => card.renderItem(item, i))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* --- MODALS (Profile, Delete Confirmation, Options) --- */}
            
            {/* Profile Modal */}
            {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}

            {/* Delete/View Report Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
                            onClick={() => setSelectedReport(null)}
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 pr-8">{selectedReport.title}</h2>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded mb-4">
                            {selectedReport.department}
                        </span>
                        <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm mb-6 max-h-60 overflow-y-auto">
                            {selectedReport.content}
                        </div>
                        <button
                            onClick={() => handleDeleteReport(selectedReport._id)}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-medium py-2 rounded-lg transition-colors border border-red-200"
                        >
                            <FaTrash /> Delete Report
                        </button>
                    </div>
                </div>
            )}

            {/* Bank Options Modal */}
            {activeModal === "bankOptions" && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
                        <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                            <FaTimes />
                        </button>
                        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Add Bank Report</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/sbbank")}
                                className="w-full p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl flex items-center justify-between group transition-all"
                            >
                                <span className="font-semibold text-indigo-700">Bank Report</span>
                                <FaArrowRight className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate("/mastersheet")}
                                className="w-full p-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl flex items-center justify-between group transition-all"
                            >
                                <span className="font-semibold text-teal-700">SB Master Checklist</span>
                                <FaArrowRight className="text-teal-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateDashboard;