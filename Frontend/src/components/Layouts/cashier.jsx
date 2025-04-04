import React, { useState, useEffect } from "react";
import axiosInstance from '../Dashboard/axiosInstance'
import BackButton from "../Home Page/backbutton";
const CashierDeposit = ({ token }) => {
    const [amount, setAmount] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [message, setMessage] = useState("");
    const [deposits, setDeposits] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [todayDate, setTodayDate] = useState("");
    // List of banks
    const banks = ["HDFC Bank", "ICICI Bank", "SBI Bank", "SBI Bank (Current Account)", "UCO Bank", "Axis Bank", "IDBI Bank", "Punjab National Bank", "Bank of Baroda", "Indus Valley Bank",];
    // Fetch deposits on mount
    useEffect(() => {
        fetchDeposits();
        updateTodayDate();
    }, []);

    // Function to update today's date
    const updateTodayDate = () => {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setTodayDate(today.toLocaleDateString("en-IN", options));
    };

    // Fetch Deposits from API
    const fetchDeposits = async () => {
        try {
            const response = await axiosInstance.get("/cashier", {
                
            });
            setDeposits(response.data);
            calculateTotal(response.data);
        } catch (error) {
            alert("Error fetching deposits:");
        }
    };

    // Calculate total deposited amount
    const calculateTotal = (data) => {
        const total = data.reduce((sum, deposit) => sum + deposit.amount, 0);
        setTotalAmount(total);
    };

    // Check if today is Sunday or Saturday
    const isBankClosed = () => {
        const today = new Date();
        const day = today.getDay(); // 0 = Sunday, 6 = Saturday
        return day === 0 || day === 6;
    };

    // Handle deposit submission
    const handleDeposit = async () => {
        if (!amount || !selectedBank) {
            setMessage("❌ Please enter amount and select a bank.");
            return;
        }

        if (isBankClosed()) {
            setMessage("❌ Bank is closed on Saturday & Sunday.");
            return;
        }

        const depositData = { amount: parseFloat(amount), bank: selectedBank ,totalamount:totalAmount};

        try {
            const response = await axiosInstance.post(
                "/cashier",
                depositData,
            );

            setMessage(`✅ ${response.data.message}`);
            setAmount("");
            setSelectedBank("");
            fetchDeposits();
        } catch (error) {
            setMessage("❌ Error saving deposit.");
        }
    };

    // Auto-hide message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
                {/* Today's Date */}
                <p className="text-center text-lg font-semibold text-gray-700 mb-2">📅 {todayDate}</p>

                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-5">🏦 Cashier Deposit</h2>

                {/* Amount Input */}
                <input
                    type="number"
                    placeholder="Enter Amount"
                    className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                {/* Bank Selection */}
                <select
                    className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                >
                    <option value="">Select Bank</option>
                    {banks.map((bank, index) => (
                        <option key={index} value={bank}>
                            {bank}
                        </option>
                    ))}
                </select>

                {/* Deposit Button */}
                <button
                    onClick={handleDeposit}
                    className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition"
                >
                    💰 Deposit Amount
                </button>

                {/* Status Message */}
                {message && (
                    <p className={`mt-3 text-center text-sm font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
            </div>

            {/* Deposits List */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📜 Deposit History</h3>

                {deposits.length === 0 ? (
                    <p className="text-gray-500 text-center">No deposits yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {deposits.map((deposit, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <p className="text-lg font-semibold text-gray-800">💰 ₹{deposit.amount}</p>
                                <p className="text-sm text-gray-600">🏦 {deposit.bank}</p>
                                <p className="text-xs text-gray-500">{new Date(deposit.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Total Amount */}
                <div className="mt-6 p-4 bg-blue-100 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-blue-700">Total Deposited: ₹{totalAmount}</h4>
                </div>
            </div>
            <div>
     <BackButton previousImage="/previous.png" />
     </div>
        </div>

    );
};

export default CashierDeposit;