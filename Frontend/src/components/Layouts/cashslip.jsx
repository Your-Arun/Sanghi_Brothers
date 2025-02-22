import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import previousImage from '/public/previous.png';

const CashSlip = () => {
    const [fecthcashSlip, setFecthcashSlip] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    useEffect(() => {
        const fetchCashSlip = async () => {
            try {
                const response = await fetch('http://localhost:5500/Cashslip');
                const data = await response.json();
                setFecthcashSlip(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCashSlip();
    }, []);

    useEffect(() => {
        fetchCashSlipByDate(selectedDate);
    }, [selectedDate]);

    const fetchCashSlipByDate = async (date) => {
        try {
            let url = `http://localhost:5500/Cashslip?date=${date}`;
            const response = await fetch(url);
            const data = await response.json();
            setFecthcashSlip(data);
        } catch (error) {
            console.error("Error fetching cash slip:", error);
        }
    };

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
    const shifts = ["First Shift", "Second Shift"];
    const [totalAmount, setTotalAmount] = useState(0);
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
    const handleUFillChange = (e) => {
        const value = e.target.value === "" ? 0 : e.target.value;
        setCashSlip(prev => ({ ...prev, uFill: value }));
    };
    const handleIciciSlipChange = (e) => {
        const value = e.target.value === "" ? 0 : e.target.value;
        setCashSlip(prev => ({ ...prev, iciciSlip: value }));
    };
    const handleSbiSlipChange = (e) => {
        const value = e.target.value === "" ? 0 : e.target.value;
        setCashSlip(prev => ({ ...prev, sbiSlip: value }));
    };
    const handlePaytmChange = (e) => {
        const value = e.target.value === "" ? 0 : e.target.value;
        setCashSlip(prev => ({ ...prev, paytm: value }));
    };
    const handleExpensesChange = (e) => {
        const value = e.target.value === "" ? 0 : e.target.value;
        setCashSlip(prev => ({ ...prev, expenses: value }));
    };
    useEffect(() => {
        const total = Object.entries(cashSlip.cashDetails).reduce(
            (acc, [denom, count]) => acc + (Number(denom) * Number(count || 0)), 0
        ) + Number(cashSlip.uFill) + Number(cashSlip.iciciSlip) + Number(cashSlip.sbiSlip) + Number(cashSlip.paytm) + Number(cashSlip.expenses);
        setTotalAmount(total);
    }, [cashSlip]);
    useEffect(() => {
        fetchCashSlip();
    }, []);

    const fetchCashSlip = async () => {
        try {
            const response = await fetch('http://localhost:5500/Cashslip');
            const data = await response.json();
            setFecthcashSlip(data);
        } catch (error) {
            console.error("Error fetching cash slip:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cashdata = {
                date: cashSlip.date,
                shift: cashSlip.shift,
                name: cashSlip.name,
                nozzleNo: cashSlip.nozzleNo,
                openingReading: cashSlip.openingReading,
                closingReading: cashSlip.closingReading,
                salesInLtr: cashSlip.salesInLtr,
                testing: cashSlip.testing,
                pending: cashSlip.pending,
                cashDetails: Object.fromEntries(
                    Object.entries(cashSlip.cashDetails).map(([denom, count]) => [
                        denom,
                        count === "" ? 0 : count,
                    ])
                ),
                uFill: cashSlip.uFill === "" ? 0 : cashSlip.uFill,
                iciciSlip: cashSlip.iciciSlip === "" ? 0 : cashSlip.iciciSlip,
                sbiSlip: cashSlip.sbiSlip === "" ? 0 : cashSlip.sbiSlip,
                paytm: cashSlip.paytm === "" ? 0 : cashSlip.paytm,
                expenses: cashSlip.expenses === "" ? 0 : cashSlip.expenses,
                total: totalAmount,
            };

            await axios.post("http://localhost:5500/Cashslip", cashdata);
            alert("Cash Slip saved successfully!");
            fetchCashSlipByDate(selectedDate);

            // ✅ Data save hone ke turant baad fetch karna
            fetchCashSlip();

        } catch (error) {
            console.error("Error saving cash slip:", error.response ? error.response.data : error);
            alert("Error saving cash slip: " + (error.response ? error.response.data.message : error.message));
        }
    };


    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
                <h2 className="text-4xl font-bold text-center text-blue-600 mb-8 ">Daily Cash Slip</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            <input type="number" value={cashSlip.uFill} onChange={handleUFillChange} className="border p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label>ICICI Slip:</label>
                            <input type="number" value={cashSlip.iciciSlip} onChange={handleIciciSlipChange} className="border p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label>SBI Slip:</label>
                            <input type="number" value={cashSlip.sbiSlip} onChange={handleSbiSlipChange} className="border p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label>Paytm:</label>
                            <input type="number" value={cashSlip.paytm} onChange={handlePaytmChange} className="border p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label>Expenses:</label>
                            <input type="number" value={cashSlip.expenses} onChange={handleExpensesChange} className="border p-2 rounded-md w-full" />
                        </div>
                    </div>

                    {/* Total Amount */}
                    <p className="text-xl font-bold text-center text-green-600">Total Amount: ₹{totalAmount}</p>

                    {/* Submit Button */}
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition">Save Cash Slip</button>
                </form>
            </div>
            {/* Cash Slips Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mt-6">
                {fecthcashSlip.map((cashSlip, index) => (
                    <div key={index} className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-bold text-blue-600">{cashSlip.name}</h3>
                        <p><strong>Shift:</strong> {cashSlip.shift}</p>
                        <p><strong>Nozzle No:</strong> {cashSlip.nozzleNo}</p>
                        <p><strong>Opening:</strong> {cashSlip.openingReading}</p>
                        <p><strong>Closing:</strong> {cashSlip.closingReading}</p>
                        <p><strong>Sales:</strong> {cashSlip.salesInLtr} L</p>
                        <p><strong>Total:</strong> ₹{cashSlip.total}</p>
                    </div>
                ))}
            </div>
            {/* Back Button */}
            <div className="fixed bottom-6 left-6 p-4 rounded-full">
                <Link to="/dashboard">
                    <img src={previousImage} alt="Back" width={50} className="rounded-full shadow-md" />
                </Link>
            </div>
        </div>
    );
};

export default CashSlip;