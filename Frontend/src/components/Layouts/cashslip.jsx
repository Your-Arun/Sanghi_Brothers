import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Dashboard/axiosInstance';
import BackButton from '../Home Page/backbutton';
import { toast } from 'react-toastify';
import UserContext from "../Home Page/UserContext";

const CashSlip = () => {
    const { user } = useContext(UserContext);

    const [fecthcashSlip, setFecthcashSlip] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    const [actualAmount, setActualAmount] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [amountDiff, setAmountDiff] = useState(0);

    const shifts = ["First Shift", "Second Shift"];

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

    const fetchCashSlipByDate = async (date) => {
        try {
            const response = await axiosInstance.get(`/Cashslip?date=${date}`);
            setFecthcashSlip(response.data);
        } catch (error) {
            toast.warning("No cash slips found for selected date");
            setFecthcashSlip([]);
        }
    };

    useEffect(() => {
        fetchCashSlipByDate(selectedDate);
    }, [selectedDate]);

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

    const updateField = (field) => (e) => {
        const value = e.target.value === "" ? 0 : e.target.value;
        setCashSlip(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        const total = Object.entries(cashSlip.cashDetails).reduce(
            (acc, [denom, count]) => acc + (Number(denom) * Number(count || 0)), 0
        ) +
            Number(cashSlip.uFill) +
            Number(cashSlip.iciciSlip) +
            Number(cashSlip.sbiSlip) +
            Number(cashSlip.paytm) +
            Number(cashSlip.expenses);

        setTotalAmount(total);
    }, [cashSlip]);

    useEffect(() => {
        const diff = Number(actualAmount || 0) - totalAmount;
        setAmountDiff(diff);
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
            fetchCashSlipByDate(selectedDate);
        } catch (error) {
            toast.warn("Error saving cash slip");
        }
    };

    const confirmDeleteToast = (onConfirm) => {
        toast(({ closeToast }) => (
            <div className="flex flex-col gap-2">
                <p>Are you sure you want to delete this?</p>
                <div className="flex gap-4 mt-2">
                    <button onClick={() => { onConfirm(); closeToast(); }} className="bg-red-500 text-white px-3 py-1 rounded">Yes</button>
                    <button onClick={closeToast} className="bg-gray-300 px-3 py-1 rounded">No</button>
                </div>
            </div>
        ), {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
        });
    };

    const handleDelete = async (id) => {
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
        <div className="flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
                <h2 className="text-4xl font-bold text-center text-blue-600 mb-6">Daily Cash Slip</h2>
                <form onSubmit={handleSubmit} className="space-y-4 font-semibold">
                    <div className="flex gap-4 flex-col sm:flex-row">
                        <input type="date" name="date" value={cashSlip.date} onChange={handleChange} required className="border p-2 rounded-md w-full" />
                        <select name="shift" value={cashSlip.shift} onChange={handleChange} required className="border p-2 rounded-md w-full">
                            <option value="">Select Shift</option>
                            {shifts.map((shift, index) => (
                                <option key={index} value={shift}>{shift}</option>
                            ))}
                        </select>
                    </div>

                    <input type="text" name="name" placeholder="Name" value={cashSlip.name} onChange={handleChange} required className="border p-2 rounded-md w-full" />

                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="nozzleNo" placeholder="Nozzle No" value={cashSlip.nozzleNo} onChange={handleChange} required className="border p-2 rounded-md" />
                        <input type="number" name="openingReading" placeholder="Opening Reading" value={cashSlip.openingReading} onChange={handleChange} required className="border p-2 rounded-md" />
                        <input type="number" name="salesInLtr" placeholder="Sales in LTR" value={cashSlip.salesInLtr} onChange={handleChange} required className="border p-2 rounded-md" />
                        <input type="number" name="closingReading" placeholder="Closing Reading" value={cashSlip.closingReading} onChange={handleChange} required className="border p-2 rounded-md" />
                        <input type="number" name="pending" placeholder="Pending" value={cashSlip.pending} onChange={handleChange} required className="border p-2 rounded-md" />
                        <input type="number" name="testing" placeholder="Testing" value={cashSlip.testing} onChange={handleChange} required className="border p-2 rounded-md" />
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md shadow-inner">
                        <h3 className="text-md font-bold mb-2">Cash Details</h3>
                        {Object.keys(cashSlip.cashDetails).map((denom) => (
                            <div key={denom} className="flex justify-between items-center mb-2">
                                <span>{denom} ×</span>
                                <input type="number" value={cashSlip.cashDetails[denom]} onChange={(e) => handleCashChange(e, denom)} className="border p-1 rounded-md w-20 text-center" />
                                <span>= ₹{denom * (cashSlip.cashDetails[denom] || 0)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="U Fill" value={cashSlip.uFill} onChange={updateField("uFill")} className="border p-2 rounded-md w-full" />
                        <input type="number" placeholder="ICICI Slip" value={cashSlip.iciciSlip} onChange={updateField("iciciSlip")} className="border p-2 rounded-md w-full" />
                        <input type="number" placeholder="SBI Slip" value={cashSlip.sbiSlip} onChange={updateField("sbiSlip")} className="border p-2 rounded-md w-full" />
                        <input type="number" placeholder="Paytm" value={cashSlip.paytm} onChange={updateField("paytm")} className="border p-2 rounded-md w-full" />
                        <input type="number" placeholder="Expenses" value={cashSlip.expenses} onChange={updateField("expenses")} className="border p-2 rounded-md w-full" />
                        <input type="number" placeholder="Actual Amount" value={actualAmount} onChange={(e) => setActualAmount(e.target.value)} className="border p-2 rounded-md w-full text-red-600 font-bold" />
                    </div>

                    <p className="text-center font-bold text-green-700">Total: ₹{totalAmount}</p>
                    <p className={`text-center font-bold ${amountDiff === 0 ? "text-blue-600" : amountDiff > 0 ? "text-green-600" : "text-red-600"}`}>
                        {amountDiff === 0 ? "Perfectly Matched" : amountDiff > 0 ? `Plus ₹${amountDiff}` : `Minus ₹${Math.abs(amountDiff)}`}
                    </p>

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition">Save Cash Slip</button>
                </form>
            </div>

            {/* Selected Date Filter UI */}
            <div className="my-6">
                <label className="font-semibold mr-2">Search by Date:</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded-md" />
            </div>

            {/* Display filtered results */}
            {fecthcashSlip.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-4 mb-5">
                    {fecthcashSlip.map((item, index) => (
                        <div key={index} className="bg-white shadow-md p-4 rounded-lg border border-gray-200 relative">
                            <h3 className="text-lg font-bold text-blue-600">{item.name}</h3>
                            <p><strong>Shift:</strong> {item.shift}</p>
                            <p><strong>Nozzle No:</strong> {item.nozzleNo}</p>
                            <p><strong>Sales:</strong> {item.salesInLtr} L</p>
                            <p><strong>Total:</strong> ₹{item.total}</p>
                            {user.department === "manager" && (
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-6">No cash slips found for {selectedDate}</p>
            )}

            <div className="mt-8">
                <BackButton previousImage="/previous.png" />
            </div>
        </div>
    );
};

export default CashSlip;
