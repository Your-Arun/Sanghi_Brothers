import React, { useState, useEffect } from "react";
import axios from "axios";

const ShiftHistoryComponent = () => {
  const [shiftHistory, setShiftHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchShiftHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5500/shifthistory?date=${selectedDate}`);
        setShiftHistory(response.data);
      } catch (error) {
        console.error("Error fetching shift history:", error);
      }
    };

    fetchShiftHistory();
  }, [selectedDate]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-3">Shift Assignment History</h2>

      {/* 📅 Date Picker */}
      <div className="mb-4">
        <label className="font-semibold">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded ml-2"
        />
      </div>

      {/* 📝 Shift History Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Member Name</th>
            <th className="border p-2">Shift</th>
            <th className="border p-2">Times Assigned</th>
          </tr>
        </thead>
        <tbody>
          {shiftHistory.map((record) => (
            <tr key={record.memberId}>
              <td className="border p-2">{record.date}</td>
              <td className="border p-2">{record.name}</td>
              <td className="border p-2">{record.shift}</td>
              <td className="border p-2 text-center">{record.assignedCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftHistoryComponent;
