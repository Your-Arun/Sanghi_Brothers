import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Dashboard/axiosInstance';
import { toast } from 'react-toastify';
import UserContext from "../Home Page/UserContext";
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaGasPump, FaMoneyBillWave, 
  FaCreditCard, FaTrash, FaHistory, FaCheckCircle, FaTint, FaRupeeSign
} from "react-icons/fa";

const CashSlip = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const initialCashSlipState = {
        date: new Date().toISOString().split("T")[0],
        shift: "",
        name: user?.username || "",
        nozzleNo: "",
        rate: "", // Added Rate to calculate amount from Liters
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

    const[fecthcashSlip, setFecthcashSlip] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
    const[cashSlip, setCashSlip] = useState(initialCashSlipState);
    
    // New Computed States
    const[netSalesLtr, setNetSalesLtr] = useState(0);
    const [expectedAmount, setExpectedAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const[shortageExcess, setShortageExcess] = useState(0);

    const shifts =["First Shift", "Second Shift"];

    // 1. Fetch History By Date
    const fetchCashSlipByDate = async (date) => {
        try {
            const response = await axiosInstance.get(`/Cashslip?date=${date}`);
            setFecthcashSlip(response.data);
        } catch (error) { setFecthcashSlip([]); }
    };

    useEffect(() => { fetchCashSlipByDate(selectedDate); }, [selectedDate]);

    // 2. Auto Fetch Opening Reading based on Nozzle No
    useEffect(() => {
        const fetchOpeningReading = async () => {
            // Check if user has entered Nozzle No
            if (cashSlip.nozzleNo && cashSlip.nozzleNo.length > 0) {
                try {
                    // NOTE: Create this endpoint in your Node/Express Backend
                    // Example: router.get('/last-reading', ...) which returns the last entry of this nozzle
                    const response = await axiosInstance.get(`/Cashslip/last-reading?nozzleNo=${cashSlip.nozzleNo}`);
                    if (response.data && response.data.closingReading) {
                        setCashSlip(prev => ({ ...prev, openingReading: response.data.closingReading }));
                        toast.success("Opening Reading Fetched!");
                    }
                } catch (error) {
                    console.log("No previous reading found for this nozzle");
                }
            }
        };
        // Adding a slight delay (debounce) so it doesn't call API on every single keystroke
        const delayTimer = setTimeout(fetchOpeningReading, 800);
        return () => clearTimeout(delayTimer);
    }, [cashSlip.nozzleNo]);

    // 3. Auto Calculate Liters & Amounts
    useEffect(() => {
        const opening = Number(cashSlip.openingReading) || 0;
        const closing = Number(cashSlip.closingReading) || 0;
        const testing = Number(cashSlip.testing) || 0;
        const pending = Number(cashSlip.pending) || 0;
        const rate = Number(cashSlip.rate) || 0;

        // Auto calculate Total Sales in Ltr (Closing - Opening)
        const grossSales = closing > opening ? (closing - opening) : 0;
        
        // Auto calculate Net Sales in Ltr (Gross - Testing - Pending)
        const netLtr = grossSales - testing - pending;
        
        // Calculate Expected Cash based on Net Liters and Rate
        const expectedCash = netLtr * rate;

        setCashSlip(prev => ({ ...prev, salesInLtr: grossSales.toFixed(2) }));
        setNetSalesLtr(netLtr > 0 ? netLtr : 0);
        setExpectedAmount(expectedCash);

    },[cashSlip.openingReading, cashSlip.closingReading, cashSlip.testing, cashSlip.pending, cashSlip.rate]);

    // 4. Calculate Total Entered Cash/Digital
    useEffect(() => {
        const cashTotal = Object.entries(cashSlip.cashDetails).reduce(
            (acc, [denom, count]) => acc + (Number(denom) * Number(count || 0)), 0
        );
        const total = cashTotal + Number(cashSlip.uFill || 0) + Number(cashSlip.iciciSlip || 0) + 
                      Number(cashSlip.sbiSlip || 0) + Number(cashSlip.paytm || 0) + Number(cashSlip.expenses || 0);
        
        setTotalAmount(total);
        
        // Shortage or Excess = Total Entered - Expected Amount
        setShortageExcess(total - expectedAmount);
    },[cashSlip.cashDetails, cashSlip.uFill, cashSlip.iciciSlip, cashSlip.sbiSlip, cashSlip.paytm, cashSlip.expenses, expectedAmount]);


    const handleChange = (e) => setCashSlip((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleCashChange = (e, denomination) => {
        const value = e.target.value;
        setCashSlip(prev => ({
            ...prev,
            cashDetails: { ...prev.cashDetails,[denomination]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!cashSlip.shift) return toast.warn("Please select shift");
        if(!cashSlip.rate) return toast.warn("Please enter Fuel Rate");
        try {
            const cashdata = { 
                ...cashSlip, 
                netSalesLtr,
                expectedAmount,
                total: totalAmount,
                shortageExcess
            };
            await axiosInstance.post("/Cashslip", cashdata);
            toast.success("Slip Saved!");
            fetchCashSlipByDate(selectedDate);
            setCashSlip(initialCashSlipState); // Reset form after save
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

                    {/* SECTION 2: READINGS & LITERS */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                            <FaGasPump className="text-blue-500" /> Meter Readings
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 ml-1">Nozzle No</label>
                                <input type="text" name="nozzleNo" value={cashSlip.nozzleNo} onChange={handleChange} className="w-full bg-slate-50 p-2.5 rounded-xl border-none text-sm font-bold border-2 focus:border-blue-400 outline-none" placeholder="Enter Nozzle" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 ml-1">Rate (₹/Ltr)</label>
                                <input type="number" name="rate" value={cashSlip.rate} onChange={handleChange} inputMode="decimal" className="w-full bg-slate-50 p-2.5 rounded-xl border-none text-sm font-bold text-blue-600" placeholder="e.g. 96.50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 ml-1">Opening Reading</label>
                                <input type="number" name="openingReading" value={cashSlip.openingReading} onChange={handleChange} inputMode="decimal" className="w-full bg-slate-50 p-2.5 rounded-xl border-none text-sm font-bold" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 ml-1">Closing Reading</label>
                                <input type="number" name="closingReading" value={cashSlip.closingReading} onChange={handleChange} inputMode="decimal" className="w-full bg-slate-50 p-2.5 rounded-xl border-none text-sm font-bold" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 ml-1">Testing (Ltr)</label>
                                <input type="number" name="testing" value={cashSlip.testing} onChange={handleChange} inputMode="decimal" className="w-full bg-slate-50 p-2.5 rounded-xl border-none text-sm font-bold" placeholder="0" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 ml-1">Pending (Ltr)</label>
                                <input type="number" name="pending" value={cashSlip.pending} onChange={handleChange} inputMode="decimal" className="w-full bg-slate-50 p-2.5 rounded-xl border-none text-sm font-bold" placeholder="0" />
                            </div>
                        </div>

                        {/* HIGHLIGHTED NET LITERS BOX */}
                        <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1"><FaTint/> Gross Ltr: {cashSlip.salesInLtr || 0}</p>
                                <p className="text-[11px] font-black text-slate-600 mt-1 uppercase">Actual Net Liters</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl font-black text-blue-700">{netSalesLtr.toFixed(2)} Ltr</h2>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: CASH LIST */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                            <FaMoneyBillWave className="text-green-500" /> Cash Received
                        </h3>
                        <div className="space-y-2">
                            {Object.keys(cashSlip.cashDetails).sort((a,b) => b-a).map((denom) => (
                                <div key={denom} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
                                    <span className="w-12 font-bold text-slate-600 text-sm">₹{denom}</span>
                                    <input type="number" value={cashSlip.cashDetails[denom]} onChange={(e) => handleCashChange(e, denom)} inputMode="numeric" placeholder="0" className="flex-grow bg-white border-none rounded-lg p-2 text-center font-bold text-green-600 shadow-sm outline-none focus:ring-1 focus:ring-green-400" />
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
                                    <input type="number" value={cashSlip[f]} onChange={(e) => setCashSlip(p => ({...p, [f]: e.target.value}))} inputMode="decimal" className="w-full bg-slate-50 p-2.5 rounded-xl border-none font-bold" placeholder="0" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HISTORY PREVIEW */}
                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-slate-400 text-xs uppercase flex items-center gap-2"><FaHistory /> Recent Slips</h3>
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="text-xs border-none bg-slate-200 rounded-lg p-1" />
                        </div>
                        <div className="space-y-3">
                            {fecthcashSlip.map((item) => (
                                <div key={item._id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-sm">{item.name} <span className="text-[10px] text-slate-400 font-normal">({item.shift})</span></p>
                                        <p className="text-xs font-black text-blue-600">₹{item.total?.toLocaleString()}</p>
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

                {/* --- STICKY BOTTOM SUMMARY BAR (SHORTAGE / EXCESS) --- */}
                <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 pb-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-50">
                    <div className="max-w-md mx-auto grid grid-cols-3 gap-2 px-2 text-center items-center">
                        
                        {/* Expected Amount (Net Ltr * Rate) */}
                        <div className="bg-slate-800 p-2 rounded-xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expected</p>
                            <p className="text-sm font-black">₹{expectedAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                        </div>

                        {/* Shortage / Excess Result */}
                        <div className={`p-2 rounded-xl border-2 ${shortageExcess === 0 ? "border-green-500 bg-green-500/10 text-green-400" : shortageExcess > 0 ? "border-blue-400 bg-blue-400/10 text-blue-400" : "border-red-500 bg-red-500/10 text-red-400"}`}>
                            <p className="text-[9px] font-bold uppercase tracking-wider mb-1">
                                {shortageExcess === 0 ? "Settled" : shortageExcess > 0 ? "Excess (+)" : "Shortage (-)"}
                            </p>
                            <p className="text-base font-black flex items-center justify-center gap-1">
                                {shortageExcess === 0 ? <FaCheckCircle/> : `₹${Math.abs(shortageExcess).toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                            </p>
                        </div>

                        {/* Total Entered Amount */}
                        <div className="bg-slate-800 p-2 rounded-xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Entered</p>
                            <p className="text-sm font-black text-green-400">₹{totalAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                        </div>
                        
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CashSlip;