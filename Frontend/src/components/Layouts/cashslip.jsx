import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Dashboard/axiosInstance';
import { toast } from 'react-toastify';
import UserContext from "../Home Page/UserContext";
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaSave, FaGasPump, FaMoneyBillWave, 
  FaCreditCard, FaTrash, FaHistory, FaCheckCircle 
} from "react-icons/fa";

const CashSlip = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

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

    const [fecthcashSlip, setFecthcashSlip] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [actualAmount, setActualAmount] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [amountDiff, setAmountDiff] = useState(0);
    const [cashSlip, setCashSlip] = useState(initialCashSlipState);

    const shifts = ["First Shift", "Second Shift"];

    const fetchCashSlipByDate = async (date) => {
        try {
            const response = await axiosInstance.get(`/Cashslip?date=${date}`);
            setFecthcashSlip(response.data);
        } catch (error) { setFecthcashSlip([]); }
    };

    useEffect(() => { fetchCashSlipByDate(selectedDate); }, [selectedDate]);

    const handleChange = (e) => setCashSlip((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleCashChange = (e, denomination) => {
        const value = e.target.value;
        setCashSlip(prev => ({
            ...prev,
            cashDetails: { ...prev.cashDetails, [denomination]: value }
        }));
    };

    useEffect(() => {
        const cashTotal = Object.entries(cashSlip.cashDetails).reduce(
            (acc, [denom, count]) => acc + (Number(denom) * Number(count || 0)), 0
        );
        const total = cashTotal + Number(cashSlip.uFill || 0) + Number(cashSlip.iciciSlip || 0) + 
                      Number(cashSlip.sbiSlip || 0) + Number(cashSlip.paytm || 0) + Number(cashSlip.expenses || 0);
        setTotalAmount(total);
    }, [cashSlip]);

    useEffect(() => {
        setAmountDiff(actualAmount !== "" ? Number(actualAmount) - totalAmount : 0);
    }, [actualAmount, totalAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!cashSlip.shift) return toast.warn("Please select shift");
        try {
            const cashdata = { ...cashSlip, total: totalAmount };
            await axiosInstance.post("/Cashslip", cashdata);
            toast.success("Slip Saved!");
            fetchCashSlipByDate(selectedDate);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) { toast.error("Error saving slip"); }
    };

    const handleDelete = (id) => {
        if(window.confirm("Delete this slip?")) {
            axiosInstance.delete(`/Cashslip/${id}`).then(() => {
                setFecthcashSlip(prev => prev.filter(item => item._id !== id));
                toast.success("Deleted");
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">
            <form onSubmit={handleSubmit}>
                {/* --- COMPACT HEADER --- */}
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => navigate(-1)} className="p-2 text-slate-600 active:bg-slate-100 rounded-full">
                            <FaArrowLeft size={18} />
                        </button>
                        <h1 className="text-lg font-bold">New Slip</h1>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform">
                        SAVE
                    </button>
                </div>

                <div className="max-w-md mx-auto p-4 space-y-4">
                    
                    {/* SECTION 1: SHIFT */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staff Name</label>
                            <input type="text" name="name" value={cashSlip.name} onChange={handleChange} className="w-full bg-slate-50 p-2 rounded-lg border-none focus:ring-2 focus:ring-blue-500 font-semibold" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                            <input type="date" name="date" value={cashSlip.date} onChange={handleChange} className="w-full bg-slate-50 p-2 rounded-lg text-sm border-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Shift</label>
                            <select name="shift" value={cashSlip.shift} onChange={handleChange} className="w-full bg-slate-50 p-2 rounded-lg text-sm border-none">
                                <option value="">Select</option>
                                {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* SECTION 2: READINGS (Compact 2-Column) */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                            <FaGasPump className="text-blue-500" /> Meter Readings
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Nozzle", name: "nozzleNo", type: "text" },
                                { label: "Opening", name: "openingReading", type: "number" },
                                { label: "Closing", name: "closingReading", type: "number" },
                                { label: "Sales Ltr", name: "salesInLtr", type: "number" },
                                { label: "Testing", name: "testing", type: "number" },
                                { label: "Pending", name: "pending", type: "number" },
                            ].map((f) => (
                                <div key={f.name}>
                                    <label className="text-[10px] font-bold text-slate-500 ml-1">{f.label}</label>
                                    <input type={f.type} name={f.name} value={cashSlip[f.name]} onChange={handleChange} inputMode={f.type === 'number' ? 'decimal' : 'text'} className="w-full bg-slate-50 p-2.5 rounded-xl border-none text-sm font-bold" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 3: CASH LIST */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                            <FaMoneyBillWave className="text-green-500" /> Cash Count
                        </h3>
                        <div className="space-y-2">
                            {Object.keys(cashSlip.cashDetails).sort((a,b) => b-a).map((denom) => (
                                <div key={denom} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
                                    <span className="w-12 font-bold text-slate-600 text-sm">₹{denom}</span>
                                    <input type="number" value={cashSlip.cashDetails[denom]} onChange={(e) => handleCashChange(e, denom)} inputMode="numeric" placeholder="0" className="flex-grow bg-white border-none rounded-lg p-2 text-center font-bold text-blue-600 shadow-sm" />
                                    <span className="w-20 text-right font-black text-xs text-slate-400">
                                        ₹{(denom * (cashSlip.cashDetails[denom] || 0)).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 4: DIGITAL & EXPENSES */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                            <FaCreditCard className="text-purple-500" /> Digital & Expenses
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["uFill", "iciciSlip", "sbiSlip", "paytm", "expenses"].map(f => (
                                <div key={f}>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">{f}</label>
                                    <input type="number" value={cashSlip[f]} onChange={(e) => setCashSlip(p => ({...p, [f]: e.target.value}))} inputMode="decimal" className="w-full bg-slate-50 p-2.5 rounded-xl border-none font-bold" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTUAL CASH IN HAND */}
                    <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100">
                        <label className="text-xs font-black text-blue-600 uppercase block mb-1">Actual Cash In Hand (Checked)</label>
                        <input type="number" value={actualAmount} onChange={(e) => setActualAmount(e.target.value)} inputMode="decimal" placeholder="Enter Cash In Hand" className="w-full bg-white border-none p-4 rounded-xl text-xl font-black text-blue-700 shadow-sm outline-none" />
                    </div>

                    {/* HISTORY PREVIEW */}
                    <div className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-slate-400 text-xs uppercase flex items-center gap-2"><FaHistory /> Recent Slips</h3>
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="text-xs border-none bg-slate-200 rounded-lg p-1" />
                        </div>
                        <div className="space-y-3">
                            {fecthcashSlip.map((item) => (
                                <div key={item._id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-sm">{item.name} <span className="text-[10px] text-slate-400 font-normal">({item.shift})</span></p>
                                        <p className="text-xs font-black text-blue-600">₹{item.total.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold uppercase">{item.nozzleNo}</span>
                                        {user.department === "manager" && (
                                            <button type="button" onClick={() => handleDelete(item._id)} className="p-2 text-red-400"><FaTrash size={14}/></button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- STICKY BOTTOM SUMMARY BAR --- */}
                <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 pb-6 rounded-t-[2.5rem] shadow-2xl z-50 transition-all">
                    <div className="max-w-md mx-auto flex justify-between items-center px-2">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculated Total</p>
                            <p className="text-2xl font-black">₹{totalAmount.toLocaleString()}</p>
                        </div>
                        {actualAmount !== "" && (
                            <div className={`text-right ${amountDiff === 0 ? "text-green-400" : amountDiff > 0 ? "text-blue-400" : "text-red-400"}`}>
                                <p className="text-[10px] font-bold uppercase">Difference</p>
                                <p className="text-xl font-black">
                                    {amountDiff === 0 ? <FaCheckCircle className="inline mb-1"/> : (amountDiff > 0 ? `+${amountDiff}` : amountDiff)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CashSlip;