import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaTimes,
    FaFolderOpen,
    FaWallet,
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
                    className="min-w-[180px] p-3 bg-gray-50 rounded shadow"
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
                    className="min-w-[180px] p-3 bg-gray-50 rounded shadow"
                >
                    <div className="font-bold text-green-700">{item.department}</div>
                    <div className="text-sm text-gray-600">
                        {new Date(item.entryDate).toLocaleDateString()}
                    </div>
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
                <div
                    key={item._id}
                    className="min-w-[180px] p-3 bg-gray-50 rounded shadow"
                >
                    <div className="font-bold">₹{item.amount}</div>
                    <div className="text-sm text-gray-600">{item.bank}</div>
                    <div className="text-sm">
                        {new Date(item.date).toLocaleDateString()}
                    </div>
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
                <div
                    key={item._id}
                    onClick={() => setSelectedReport(item)}
                    className="min-w-[180px] p-3 bg-gray-50 rounded shadow cursor-pointer"
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
                        <div className="flex space-x-4 overflow-x-auto pb-3 scrollbar-hide">
                            {card.items.slice(0, 4).map(card.renderItem)}
                        </div>
                        {card.count > 4 && (
                            <button
                                onClick={card.onView}
                                className="mt-3 text-blue-500 hover:underline"
                            >
                                See All
                            </button>
                        )}

                        {/* Modal */}
                        {card.more && (
                            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg relative overflow-auto max-h-[80vh]">
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="absolute top-3 right-3"
                                    >
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
                        <button
                            className="absolute top-3 right-3"
                            onClick={() => setSelectedReport(null)}
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-xl font-bold mb-2">{selectedReport.title}</h2>
                        <p className="text-gray-700">{selectedReport.content}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                            onClick={() => setSelectedReport(null)}
                        >
                            Close
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
