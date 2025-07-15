import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaTimes,
    FaFolderOpen,
    FaWallet, FaTrash,
    FaComments,
    FaUniversity,
} from "react-icons/fa";
import add from "/add.png";
import ProfileModal from "./profile";
import axiosInstance from "./axiosInstance";
import UserContext from "../Home Page/UserContext";
import { toast } from "react-toastify";

const UpdateDashboard = () => {
    const [reports, setReports] = useState([]);
    const [reportfile, setReportFile] = useState([]);
    const [cashier, setCashier] = useState([]);
    const [bankReport, setBankReport] = useState([]);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [fundposiii, setFundposii] = useState(null);
    const [fundposition, setFundPosition] = useState([]);
    const [inOutFlow, setInOutFlow] = useState([]);
    const [masterSheet, setMasterSheet] = useState([]);
    const [cashierTotal, setCashierTotal] = useState(0);


    const navigate = useNavigate();
    const { user } = useContext(UserContext);

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
                    masterRes
                ] = await Promise.all([
                    axiosInstance.get("/reports"),
                    axiosInstance.get("/cashier"),
                    axiosInstance.get("/reportfile"),
                    axiosInstance.get("/bank/monthlyfundflow"),
                    axiosInstance.get("/fundposition"),
                    axiosInstance.get("/bank/monthlyflow"),
                    axiosInstance.get("/mastersheet/finance")
                ]);

                setReports(reportRes.data);
                setCashier(cashierRes.data);
                setReportFile(reportfileRes.data);
                setBankReport(bankRes.data);
                setFundPosition(fundRes.data);
                setInOutFlow(flowRes.data);
                setMasterSheet(masterRes.data);

                // ✅ Calculate cashier total here
                const total = cashierRes.data.reduce((sum, item) => sum + item.amount, 0);
                setCashierTotal(total);
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
            case "SB Bank Report":
                navigate(`/bank/monthlyfundflow/${item._id}`);
                break;
            case "Fund Position":
                navigate(`/fundposition/${item._id}`);
                break;
            case "In-Out Flow":
                navigate(`/bank/monthlyflow/${item._id}`);
                break;
            case "Master Checklist":
                navigate(`/mastersheet/finance/${item._id}`);
                break;
            default:
                toast.error("Invalid report type");
        }
    };
    const confirmDeleteToast = (onConfirm) => {
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to delete this ?</p>
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={() => {
                                onConfirm()
                                closeToast()
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Yes
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-gray-300 px-3 py-1 rounded"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        )
    }
    const handleDeleteReport = async (reportId) => {
        confirmDeleteToast(async () => {
            try {
                await axiosInstance.delete(`/reports/${reportId}`, { withCredentials: true });
                setReports((prev) => prev.filter((report) => report._id !== reportId));
                toast.success("Report deleted successfully!");
            } catch (error) {
                toast.error("Failed to delete report. Please try again.");
            }
        })
    };

    const cards = [
        {
            title: "Bank Reports",
            icon: <FaFolderOpen className="text-4xl text-red-500" />,
            count: bankReport.length,
            onAdd: () => setActiveModal("bankOptions"), // Show option modal
            onView: () => setActiveModal("bank"),
            items: bankItems,
            more: activeModal === "bank",
            renderItem: (item, index) => (
                <div
                    key={item._id || index}
                    onClick={() => handleBankItemClick(item)}
                    className="min-w-[180px] p-3 bg-gray-100 rounded shadow cursor-pointer"
                >
                    <div className="font-bold text-sm text-gray-700">{item.type}</div>
                    <div className="text-xs text-gray-500">
                        {new Date(item.createdAt || item.Date || item.dat2 || item.date).toLocaleDateString("en-GB")}
                    </div>
                </div>
            ),
        }

        ,
        {
            title: "Report Files",
            icon: <FaFolderOpen className="text-4xl text-blue-500" />,
            count: reportfile.length,
            onAdd: () => navigate("/reportfile"),
            onView: () => setActiveModal("reportfile"),
            items: reportfile,
            more: activeModal === "reportfile",
            renderItem: (item) => (
                <div
                    key={item._id}
                    onClick={() => navigate(`/reportfile/${item._id}`)}
                    className="min-w-[180px] p-3 bg-gray-100 rounded shadow cursor-pointer"
                >
                    <div className="text-bold text-sm text-gray-700">Cash Sales:</div>
                    <div className='text-sm text-gray-700'>₹ {item.reports.cashsales}</div>
                    <div className="text-xs text-gray-500">
                        {new Date(item.entryDate).toLocaleDateString()}
                    </div>

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
                <div
                    key={item._id}
                    className="min-w-[180px] p-3 bg-gray-100 rounded shadow"
                >
                    <div className="font-bold">₹{item.amount}</div>
                    <div className="text-sm text-gray-600">{item.bank}</div>
                    <div className="text-sm">{new Date(item.date).toLocaleDateString()}</div>
                </div>
            ),
            // ✅ Add custom extraContent to show total
            extraContent: (
                <div className="text-sm font-bold text-gray-700 mt-1">
                    Total: ₹{cashierTotal.toLocaleString("en-IN")}
                </div>
            )
        }
        ,
        {
            title: "Complaints",
            icon: <FaComments className="text-4xl text-red-500" />,
            count: reports.length,
            onAdd: () => navigate("/report"),
            onView: () => setActiveModal("reports"),
            items: reports,
            more: activeModal === "reports",
            renderItem: (item) => (
                <div
                    key={item._id}
                    onClick={() => setSelectedReport(item)}
                    className="min-w-[180px] p-3 bg-gray-100 rounded shadow cursor-pointer"
                >
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.department}</div>
                </div>
            ),
        },
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

            {/* Department Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <FaUniversity className="text-4xl text-purple-500" />
                    <h2 className="text-2xl font-semibold text-gray-800">Departments</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    {["Manager", "Accounts/Finance", "Backoffice"].map((name) => (
                        <div
                            key={name}
                            onClick={() => viewReports(name)}
                            className="cursor-pointer min-w-[160px] flex-1 sm:flex-none sm:w-[180px] h-[100px] bg-yellow-100 hover:bg-yellow-200 p-4 rounded shadow text-center transition-all duration-300 flex items-center justify-center"
                        >
                            <div className="font-semibold text-indigo-700 uppercase">
                                {name}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.title} className="bg-white p-5 rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <div>{card.icon}</div>
                            <div className="text-xl font-semibold">{card.title}</div>
                            {card.onAdd && (
                                <img
                                    src={add}
                                    alt="Add"
                                    className="w-6 cursor-pointer"
                                    onClick={card.onAdd}
                                />
                            )}
                        </div>
                        {/* ✅ Show total amount if present */}
                        {card.extraContent && card.extraContent}
                        {/* Only first 4 items shown here */}
                        <div className="grid grid-cols-2 gap-2 overflow-x-auto p-4 scrollbar-hide">
                            {card.items.slice(0, 4).map((item, idx) => card.renderItem(item, idx))}
                        </div>

                        {/* See All button if more than 4 items */}
                        {card.items.length > 4 && (
                            <div
                                onClick={card.onView}
                                className="mt-3 text-blue-500 cursor-pointer hover:underline"
                            >
                                See All
                            </div>
                        )}

                        {/* Full List Modal */}
                        {card.more && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                                <div className="bg-white w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg shadow-lg relative p-6">
                                    <div
                                        onClick={() => setActiveModal(null)}
                                        className="absolute top-3 right-3 text-gray-500 hover:text-black"
                                    >
                                        <FaTimes />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {card.items.map((item, idx) => card.renderItem(item, idx))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Access Buttons Section */}
            <div className="relative flex flex-col items-center mt-6">
                <div className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
                    <button
                        onClick={() => navigate("/shifting")}
                        className="bg-red-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transform hover:scale-105 transition-all ease-in-out w-full"
                    >
                        👫 <span className="ml-2">SHIFTING ARRANGEMENT</span>
                    </button>
                    <button
                        onClick={() => navigate("/lekhajokha")}
                        className="bg-orange-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transform hover:scale-105 transition-all ease-in-out w-full"
                    >
                        📄 <span className="ml-2">LEKHA JOKHA</span>
                    </button>
                    <button
                        onClick={() => navigate("/exceluploader")}
                        className="bg-blue-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all ease-in-out w-full"
                        aria-label="Upload File"
                    >
                        📤 <span className="ml-2">UPLOAD FILE</span>
                    </button>
                    <button
                        onClick={() => navigate("/createmeterclose")}
                        className="bg-purple-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 transform hover:scale-105 transition-all ease-in-out w-full"
                        aria-label="Meter Close"
                    >
                        🔒 <span className="ml-2">METER CLOSE</span>
                    </button>
                    <button
                        onClick={() => navigate("/Cashslip")}
                        className="bg-purple-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 transform hover:scale-105 transition-all ease-in-out w-full"
                        aria-label="Cash Slip"
                    >
                        💵 <span className="ml-2">Cash Slip</span>
                    </button>
                </div>
            </div>


            {/* Report Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-md p-6 rounded-lg relative">
                        <button
                            className="absolute top-3 right-3"
                            onClick={() => setSelectedReport(null)}
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-xl font-bold mb-2">{selectedReport.title}</h2>
                        <p className="text-gray-700">{selectedReport.content}</p>

                        <button
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 flex items-center justify-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReport(selectedReport._id);
                                setSelectedReport(null);
                            }}
                        >
                            <FaTrash /> Delete
                        </button>

                    </div>
                </div>
            )}

            {/* Bank Report Option Modal */}
            {activeModal === "bankOptions" && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-md p-6 rounded-lg relative">
                        <button onClick={() => setActiveModal(null)} className="absolute top-3 right-3 text-gray-600 hover:text-black">
                            <FaTimes />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center text-indigo-600">Select Bank Report Type</h2>
                        <div className="space-y-4">
                            <div
                                onClick={() => navigate("/sbbank")}
                                className="p-4 bg-green-100 hover:bg-green-200 rounded shadow cursor-pointer transition"
                            >
                                <h3 className="text-lg font-semibold text-red-700">📊 SB Bank Report</h3>
                            </div>
                            <div
                                onClick={() => navigate("/bank/monthlyfundflow")}
                                className="p-4 bg-purple-100 hover:bg-purple-200 rounded shadow cursor-pointer transition"
                            >
                                <h3 className="text-lg font-semibold text-pink-700">📅 Monthly Fund Flow</h3>
                            </div>
                            <div
                                onClick={() => navigate("/mastersheet")}
                                className="p-4 bg-blue-100 hover:bg-blue-200 rounded shadow cursor-pointer transition"
                            >
                                <h3 className="text-lg font-semibold text-green-700">✅ SB Master CheckList</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default UpdateDashboard;
