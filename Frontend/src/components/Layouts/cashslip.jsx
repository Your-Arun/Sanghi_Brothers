import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import previousImage from '/public/previous.png';

const CashSlip = () => {
  const [cashSlip, setCashSlip] = useState ({
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
    const value = Number(e.target.value) || 0;
    setCashSlip(prev => ({
      ...prev,
      cashDetails: { ...prev.cashDetails, [denomination]: value }
    }));
  };

  const handleUFillChange = (e) => {
    setCashSlip(prev => ({ ...prev, uFill: e.target.value }));
  };

  const handleIciciSlipChange = (e) => {
    setCashSlip(prev => ({ ...prev, iciciSlip: e.target.value }));
  };

  const handleSbiSlipChange = (e) => {
    setCashSlip(prev => ({ ...prev, sbiSlip: e.target.value }));
  };

  const handlePaytmChange = (e) => {
    setCashSlip(prev => ({ ...prev, paytm: e.target.value }));
  };

  const handleExpensesChange = (e) => {
    setCashSlip(prev => ({ ...prev, expenses: e.target.value }));
  };

  useEffect(() => {
    const total = Object.entries(cashSlip.cashDetails).reduce(
      (acc, [denom, count]) => acc + (Number(denom) * Number(count || 0)), 0
    ) + Number(cashSlip.uFill) + Number(cashSlip.iciciSlip) + Number(cashSlip.sbiSlip) + Number(cashSlip.paytm) + Number(cashSlip.expenses);
    setTotalAmount(total);
  }, [cashSlip]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cashdata= {
        cashSlip,
        shifts,
        totalAmount,
        };

    const response = await axios.post("http://localhost:5500/Cashslip", cashdata); // POST request to backend
    if (response.ok) {
      alert("Cash slip saved successfully!");
      setCashSlip({
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
    } else {
      console.error("Error saving cash slip", response);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Daily Cash Slip</h2>
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