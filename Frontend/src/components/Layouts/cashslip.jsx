import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Dashboard/axiosInstance'
import BackButton from '../Home Page/backbutton';
import { toast } from 'react-toastify'
import UserContext from "../Home Page/UserContext";

const CashSlip = () => {
    const [fecthcashSlip, setFecthcashSlip] = useState([]);
    const { user } = useContext(UserContext);

    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    const [actualAmount, setActualAmount] = useState(0);
    const [difference, setDifference] = useState(0);

    const [cashSlip, setCashSlip] = useState({
        date: "",
        shift: "",
        name: "",
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
    });

    const [totalAmount, setTotalAmount] = useState(0);
    const shifts = ["First Shift", "Second Shift"];

    useEffect(() => {
        fetchCashSlipByDate(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        const total = Object.entries(cashSlip.cashDetails).reduce(
            (acc, [denom, count]) => acc + (Number(denom) * Number(count || 0)), 0
        ) + Number(cashSlip.uFill) + Number(cashSlip.iciciSlip) + Number(cashSlip.sbiSlip) + Number(cashSlip.paytm) + Number(cashSlip.expenses);
        setTotalAmount(total);
    }, [cashSlip]);

    useEffect(() => {
        setDifference(actualAmount - totalAmount);
    }, [actualAmount, totalAmount]);

    const handleChange = (e) => {
        setCashSlip((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCashChange = (e, denomination) => {
        const value = e.target.value === "" ? 0 : e.target.value;
        setCashSlip(prev => ({
            ...prev,
            cashDetails: { ...prev.cashDetails, [denomination]: value }
        }));
    };

    const handleNumberField = (field) => (e) => {
        const value = e.target.value === "" ? 0 : e.target.value;
        setCashSlip(prev => ({ ...prev, [field]: value }));
    };

    const fetchCashSlipByDate = async (date) => {
        try {
            const response = await axiosInstance.get(`/Cashslip?date=${date}`);
            setFecthcashSlip(response.data);
        } catch (error) {
            toast.warning("Error fetching cash slip:");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cashdata = {
                ...cashSlip,
                cashDetails: Object.fromEntries(
                    Object.entries(cashSlip.cashDetails).map(([denom, count]) => [denom, count === "" ? 0 : count])
                ),
                uFill: cashSlip.uFill === "" ? 0 : cashSlip.uFill,
                iciciSlip: cashSlip.iciciSlip === "" ? 0 : cashSlip.iciciSlip,
                sbiSlip: cashSlip.sbiSlip === "" ? 0 : cashSlip.sbiSlip,
                paytm: cashSlip.paytm === "" ? 0 : cashSlip.paytm,
                expenses: cashSlip.expenses === "" ? 0 : cashSlip.expenses,
                total: totalAmount,
            };

            await axiosInstance.post("/Cashslip", cashdata);
            toast.success("Cash Slip saved successfully!");
            fetchCashSlipByDate(selectedDate);
        } catch (error) {
            toast.warn("Error saving cash slip:");
        }
    };

    const confirmDeleteToast = (onConfirm) => {
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to delete this?</p>
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

    const handleDelete = async (id) => {
        confirmDeleteToast(async () => {
            try {
                await axiosInstance.delete(`/Cashslip/${id}`);
                setFecthcashSlip(prev => prev.filter(item => item._id !== id));
                toast.success("Deleted successfully");
            } catch (error) {
                toast.error("Failed to delete");
            }
        })
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
                <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">Daily Cash Slip</h2>
                <form onSubmit={handleSubmit} className="space-y-4 font-bold">
                    {/* Date & Shift */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input type="date" name="date" value={cashSlip.date} onChange={handleChange} required className="border p-2 rounded-md w-full" />
                        <select name="shift" value={cashSlip.shift} onChange={handleChange} required className="border p-2 rounded-md w-full">
                            <option value="">Select Shift</option>
                            {shifts.map((shift, index) => (
                                <option key={index} value={shift}>{shift}</option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <input type="text" name="name" placeholder="Name" value={cashSlip.name} onChange={handleChange} required className="border p-2 rounded-md w-full" />

                    {/* Nozzle Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="nozzleNo" placeholder="Nozzle No" value={cashSlip.nozzleNo} onChange={handleChange} required className=" border p-2 rounded-md" />
                        <input type="number" name="openingReading" placeholder="Opening Reading" value={cashSlip.openingReading} onChange={handleChange} required className="border p-2 rounded-md" />
                        <input type="number" name="salesInLtr" placeholder="Sales in LTR" value={cashSlip.salesInLtr} onChange={handleChange} required className="border p-2 rounded-md" />
                        <input type="number" name="closingReading" placeholder="Closing Reading" value={cashSlip.closingReading} onChange={handleChange} required className="border p-2 rounded-md" />
                    </div>

                    {/* Testing & Pending */}
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" name="pending" placeholder="Pending" value={cashSlip.pending} onChange={handleChange} required className="border p-2 rounded-md" />
                        <input type="number" name="testing" placeholder="Testing" value={cashSlip.testing} onChange={handleChange} required className="border p-2 rounded-md" />
                    </div>

                    {/* Cash Details */}
                    <h3 className="text-lg font-semibold text-gray-700">Cash Details:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                        {Object.keys(cashSlip.cashDetails).map((denom) => (
                            <div key={denom} className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{denom} ×</span>
                                <input type="number" value={cashSlip.cashDetails[denom]} onChange={(e) => handleCashChange(e, denom)} className="border p-2 rounded-md w-20 text-center" />
                                <span className="text-gray-700 font-medium">= {denom * (cashSlip.cashDetails[denom] || 0)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Additional Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label>U Fill:</label>
                            <input type="number" value={cashSlip.uFill} onChange={handleNumberField("uFill")} className="border p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label>ICICI Slip:</label>
                            <input type="number" value={cashSlip.iciciSlip} onChange={handleNumberField("iciciSlip")} className="border p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label>SBI Slip:</label>
                            <input type="number" value={cashSlip.sbiSlip} onChange={handleNumberField("sbiSlip")} className="border p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label>Paytm:</label>
                            <input type="number" value={cashSlip.paytm} onChange={handleNumberField("paytm")} className="border p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label>Expenses:</label>
                            <input type="number" value={cashSlip.expenses} onChange={handleNumberField("expenses")} className="border p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label>Actual Amount:</label>
                            <input type="number" value={actualAmount} onChange={(e) => setActualAmount(Number(e.target.value))} className="border p-2 rounded-md w-full" />
                        </div>
                    </div>

                    {/* Totals Display */}
                    <div className="text-center space-y-1 mt-2">
                        <p className="text-lg font-semibold text-blue-700">Total Amount: ₹{totalAmount}</p>
                        <p className="text-lg font-semibold text-gray-700">Actual Amount: ₹{actualAmount}</p>
                        <p className={`text-lg font-bold ${
                            difference === 0 ? "text-green-600" :
                            difference > 0 ? "text-blue-600" : "text-red-600"
                        }`}>
                            {difference === 0
                                ? "✔ No Difference"
                                : difference > 0
                                ? `+₹${difference} Extra`
                                : `-₹${Math.abs(difference)} Less`}
                        </p>
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition">Save Cash Slip</button>
                </form>
            </div>

            {/* Display Saved Slips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mt-6">
                {fecthcashSlip.map((cashSlip, index) => (
                    <div key={index} className="bg-white shadow-md p-4 rounded-lg border border-gray-200 relative group">
                        <h3 className="text-lg font-bold text-blue-600">{cashSlip.name}</h3>
                        <p><strong>Shift:</strong> {cashSlip.shift}</p>
                        <p><strong>Nozzle No:</strong> {cashSlip.nozzleNo}</p>
                        <p><strong>Opening:</strong> {cashSlip.openingReading}</p>
                        <p><strong>Closing:</strong> {cashSlip.closingReading}</p>
                        <p><strong>Sales:</strong> {cashSlip.salesInLtr} L</p>
                        <p><strong>Total:</strong> ₹{cashSlip.total}</p>
                        {user.department === "manager" && (
                            <button
                                onClick={() => handleDelete(cashSlip._id)}
                                className="absolute top-2 right-2 bg-transparent text-red-600 hover:text-red-800 font-bold text-sm"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div><BackButton previousImage="/previous.png" /></div>
        </div>
    );
};

export default CashSlip;
