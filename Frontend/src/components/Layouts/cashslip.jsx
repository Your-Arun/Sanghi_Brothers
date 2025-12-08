import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Dashboard/axiosInstance';
import { toast } from 'react-toastify';
import UserContext from "../Home Page/UserContext";
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaCalendarAlt, 
  FaGasPump, 
  FaMoneyBillWave, 
  FaCreditCard, 
  FaTrash,
  FaCalculator 
} from "react-icons/fa";

const CashSlip = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // --- INITIAL STATE (For Resetting) ---
    const initialCashSlipState = {
        date: new Date().toISOString().split("T")[0],
        shift: "",
        name: user?.username || "",
        nozzleNo: "",
        openingReading: "",
        closingReading: "",
        salesInLtr: "",
        testing: "",
        pending: "",
        cashDetails: { 500: "", 200: "", 100: "", 50: "", 20: "", 10: "" },
        uFill: "",
        iciciSlip: "",
        sbiSlip: "",
        paytm: "",
        expenses: "",
        total: "",
    };

    // --- STATE ---
    const [fecthcashSlip, setFecthcashSlip] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

    const [actualAmount, setActualAmount] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [amountDiff, setAmountDiff] = useState(0);

    const shifts = ["First Shift", "Second Shift"];

    const [cashSlip, setCashSlip] = useState(initialCashSlipState);

    // --- FETCH DATA ---
    const fetchCashSlipByDate = async (date) => {
        try {
            const response = await axiosInstance.get(`/Cashslip?date=${date}`);
            setFecthcashSlip(response.data);
        } catch (error) {
            setFecthcashSlip([]);
        }
    };

    useEffect(() => {
        fetchCashSlipByDate(selectedDate);
    }, [selectedDate]);

    // --- HANDLERS ---
    const handleChange = (e) => {
        setCashSlip((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCashChange = (e, denomination) => {
        const value = e.target.value === "" ? "" : e.target.value;
        setCashSlip(prev => ({
            ...prev,
            cashDetails: { ...prev.cashDetails, [denomination]: value }
        }));
    };

    const updateField = (field) => (e) => {
        const value = e.target.value === "" ? "" : e.target.value;
        setCashSlip(prev => ({ ...prev, [field]: value }));
    };

    // --- CALCULATIONS ---
    useEffect(() => {
        const cashTotal = Object.entries(cashSlip.cashDetails).reduce(
            (acc, [denom, count]) => acc + (Number(denom) * Number(count || 0)), 0
        );
        
        const total = cashTotal +
            Number(cashSlip.uFill || 0) +
            Number(cashSlip.iciciSlip || 0) +
            Number(cashSlip.sbiSlip || 0) +
            Number(cashSlip.paytm || 0) +
            Number(cashSlip.expenses || 0);

        setTotalAmount(total);
    }, [cashSlip]);

    useEffect(() => {
        if(actualAmount !== "") {
            const diff = Number(actualAmount) - totalAmount;
            setAmountDiff(diff);
        } else {
            setAmountDiff(0);
        }
    }, [actualAmount, totalAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cashdata = {
                ...cashSlip,
                cashDetails: Object.fromEntries(
                    Object.entries(cashSlip.cashDetails).map(([denom, count]) => [
                        denom,
                        count === "" ? 0 : count,
                    ])
                ),
                uFill: cashSlip.uFill || 0,
                iciciSlip: cashSlip.iciciSlip || 0,
                sbiSlip: cashSlip.sbiSlip || 0,
                paytm: cashSlip.paytm || 0,
                expenses: cashSlip.expenses || 0,
                total: totalAmount,
            };

            await axiosInstance.post("/Cashslip", cashdata);
            toast.success("Cash Slip saved successfully!");
            fetchCashSlipByDate(selectedDate)

        } catch (error) {
            toast.warn("Error saving cash slip");
        }
    };

    // --- CUSTOM TOAST FOR DELETE ---
    const confirmDeleteToast = (onConfirm) => {
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-gray-800">Are you sure you want to delete this?</p>
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => {
                                onConfirm();
                                closeToast();
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                            Yes, Delete
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            { position: "top-center", autoClose: false, closeOnClick: false, closeButton: false }
        );
    }

    const handleDelete = (id) => {
        confirmDeleteToast(async () => {
            try {
                await axiosInstance.delete(`/Cashslip/${id}`);
                setFecthcashSlip(prev => prev.filter(item => item._id !== id));
                toast.success("Deleted successfully");
            } catch {
                toast.error("Failed to delete");
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
            <form onSubmit={handleSubmit}>
                
                {/* --- STICKY HEADER --- */}
                <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition">
                            <FaArrowLeft />
                         </button>
                         <h1 className="text-xl font-bold text-gray-800">Daily Cash Slip</h1>
                    </div>
                    <button 
                        type="submit" 
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg active:scale-95"
                    >
                        <FaSave /> <span className="hidden sm:inline">Save Slip</span>
                    </button>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                    {/* --- CARD 1: Basic Details --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-500" /> Shift Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Date</label>
                                <input 
                                    type="date" 
                                    name="date" 
                                    value={cashSlip.date} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Shift</label>
                                <select 
                                    name="shift" 
                                    value={cashSlip.shift} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="">Select Shift</option>
                                    {shifts.map((shift, index) => (
                                        <option key={index} value={shift}>{shift}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Staff Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Name" 
                                    value={cashSlip.name} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- CARD 2: Meter Readings --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <FaGasPump className="text-red-500" /> Meter Reading
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                                { label: "Nozzle No", name: "nozzleNo", type: "text" },
                                { label: "Opening Reading", name: "openingReading", type: "number" },
                                { label: "Closing Reading", name: "closingReading", type: "number" },
                                { label: "Sales (Ltr)", name: "salesInLtr", type: "number" },
                                { label: "Testing", name: "testing", type: "number" },
                                { label: "Pending", name: "pending", type: "number" },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{field.label}</label>
                                    <input 
                                        type={field.type} 
                                        name={field.name} 
                                        value={cashSlip[field.name]} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none transition" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- CARD 3: Cash Denominations --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <FaMoneyBillWave className="text-green-600" /> Cash Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            {Object.keys(cashSlip.cashDetails).sort((a,b) => b-a).map((denom) => (
                                <div key={denom} className="flex items-center justify-between border-b border-gray-50 py-2">
                                    <span className="font-medium text-gray-600 w-16">₹ {denom}</span>
                                    <span className="text-gray-400 mx-2">×</span>
                                    <input 
                                        type="number" 
                                        value={cashSlip.cashDetails[denom]} 
                                        onChange={(e) => handleCashChange(e, denom)} 
                                        className="w-20 text-center border border-gray-300 rounded p-1 focus:ring-1 focus:ring-green-500 outline-none" 
                                        placeholder="0"
                                    />
                                    <span className="text-gray-400 mx-2">=</span>
                                    <span className="font-bold text-gray-800 w-20 text-right">
                                        ₹ {(denom * (cashSlip.cashDetails[denom] || 0)).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- CARD 4: Digital & Expenses --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <FaCreditCard className="text-purple-500" /> Digital & Expenses
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                                { label: "U Fill", name: "uFill" },
                                { label: "ICICI Slip", name: "iciciSlip" },
                                { label: "SBI Slip", name: "sbiSlip" },
                                { label: "Paytm", name: "paytm" },
                                { label: "Expenses", name: "expenses" },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{field.label}</label>
                                    <input 
                                        type="number" 
                                        value={cashSlip[field.name]} 
                                        onChange={updateField(field.name)} 
                                        className="w-full p-2 border border-gray-300 rounded focus:border-purple-500 outline-none" 
                                        placeholder="0"
                                    />
                                </div>
                            ))}
                             {/* Actual Amount Input */}
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Actual Cash In Hand</label>
                                <input 
                                    type="number" 
                                    value={actualAmount} 
                                    onChange={(e) => setActualAmount(e.target.value)} 
                                    className="w-full p-2 border-2 border-blue-200 rounded focus:border-blue-500 outline-none font-bold text-blue-700" 
                                    placeholder="Enter amount"
                                />
                             </div>
                        </div>
                    </div>

                    {/* --- TOTAL SUMMARY --- */}
                    <div className="bg-gray-800 text-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-gray-400 text-sm uppercase tracking-wide">Calculated Total</p>
                            <p className="text-3xl font-bold">₹ {totalAmount.toLocaleString()}</p>
                        </div>
                        
                        {actualAmount !== "" && (
                            <div className={`px-6 py-2 rounded-lg font-bold text-lg flex items-center gap-2 shadow-inner
                                ${amountDiff === 0 ? "bg-green-500 text-white" : amountDiff > 0 ? "bg-blue-500 text-white" : "bg-red-500 text-white"}`}>
                                <FaCalculator />
                                {amountDiff === 0 ? "Perfect Match" : amountDiff > 0 ? `+ ₹${amountDiff}` : `- ₹${Math.abs(amountDiff)}`}
                            </div>
                        )}
                    </div>

                    {/* --- PREVIOUS SLIPS SECTION --- */}
                    <div className="pt-8 border-t border-gray-200">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">History</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Filter Date:</span>
                                <input 
                                    type="date" 
                                    value={selectedDate} 
                                    onChange={(e) => setSelectedDate(e.target.value)} 
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                />
                            </div>
                         </div>

                         {fecthcashSlip.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {fecthcashSlip.map((item, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition relative group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-blue-600">{item.name}</span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.shift}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1 mb-3">
                                            <div className="flex justify-between"><span>Nozzle:</span> <span>{item.nozzleNo}</span></div>
                                            <div className="flex justify-between"><span>Sales:</span> <span>{item.salesInLtr} L</span></div>
                                        </div>
                                        <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                                            <span className="text-xs text-gray-400">Total Amount</span>
                                            <span className="font-bold text-gray-800">₹ {item.total}</span>
                                        </div>

                                        {(user.department === "manager") && (
                                            <button 
                                                type="button" // Important: Prevents form submission
                                                onClick={() => handleDelete(item._id)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                            >
                                                <FaTrash size={12}/>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                         ) : (
                            <div className="text-center py-10 bg-white border border-dashed border-gray-300 rounded-lg text-gray-400">
                                No slips found for {new Date(selectedDate).toLocaleDateString()}.
                            </div>
                         )}
                    </div>

                </div>
            </form>
        </div>
    );
};

export default CashSlip;