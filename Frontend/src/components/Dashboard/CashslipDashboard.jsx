import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4CAF50", "#F44336", "#FF9800", "#2196F3", "#9C27B0", "#00BCD4"];
const EMPTY_COLOR = "#E0E0E0"; // missing slips ke liye

const CashslipDashboard = ({ slips }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [filter, setFilter] = useState("today");

  // ✅ Filter slips based on tab
  const filteredSlips =
    filter === "today"
      ? slips.filter((s) => s.date === today)
      : slips.filter((s) => s.date !== today);

  // ✅ Group by shift
  const firstShift = filteredSlips.filter((s) => s.shift === "first");
  const secondShift = filteredSlips.filter((s) => s.shift === "second");

  // ✅ Helper: make 6 slots per shift
  const prepareShiftData = (shiftSlips) => {
    const data = [];
    for (let i = 0; i < 6; i++) {
      const slip = shiftSlips[i];
      if (slip) {
        data.push({
          name: `Slip ${i + 1}`,
          value: slip.salesInLtr || 0,
          isFilled: true,
        });
      } else {
        data.push({
          name: `Slip ${i + 1}`,
          value: 0,
          isFilled: false,
        });
      }
    }
    return data;
  };

  const firstShiftData = prepareShiftData(firstShift);
  const secondShiftData = prepareShiftData(secondShift);

  // ✅ Total Sales
  const totalSales = filteredSlips.reduce(
    (acc, slip) => acc + (slip.salesInLtr || 0),
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 text-center">💵 Cash Slips</h2>
      <div className="flex justify-center gap-4 mt-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            filter === "today" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("today")}
        >
          Today
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            filter === "other" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("other")}
        >
          Other
        </button>
        <button
          onClick={() => navigate("/Cashslip")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-transform hover:scale-105"
        >
          ➕ Submit New Cash Slip
        </button>
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-10 justify-center items-center mt-10">
        {/* First Shift */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold mb-4">First Shift</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={firstShiftData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) =>
                value > 0 ? `${name}: ${value} L` : `${name}: -`
              }
            >
              {firstShiftData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isFilled ? COLORS[index % COLORS.length] : EMPTY_COLOR}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Second Shift */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold mb-4">Second Shift</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={secondShiftData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) =>
                value > 0 ? `${name}: ${value} L` : `${name}: -`
              }
            >
              {secondShiftData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isFilled ? COLORS[index % COLORS.length] : EMPTY_COLOR}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Total Sale */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center h-fit">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">📊 Total Sales</h3>
          <p className="text-3xl font-bold text-green-600">{totalSales} L</p>
        </div>
      </div>
    </div>
  );
};

export default CashslipDashboard;
