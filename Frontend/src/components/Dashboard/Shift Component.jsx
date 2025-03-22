import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ShiftList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    fetchShifts();
  }, [selectedDate]);

  const fetchShifts = async () => {
    try {
      // Convert selectedDate to "DD/MM/YYYY" format
      const formattedDate = selectedDate.toLocaleDateString("en-GB"); // "22/03/2025"
      
      const response = await axios.get(`http://localhost:5500/getshifts?date=${formattedDate}`);
      
      console.log("API Response:", response.data);
      
      setShifts(Array.isArray(response.data.shifts) ? response.data.shifts : []);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setShifts([]); // Ensure empty array on error
    }
  };
  
  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold text-center mb-4">Shifts by Date</h2>

      {/* 📅 Date Picker */}
      <div className="flex justify-center mb-5">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="p-2 border rounded-md text-lg"
        />
      </div>

      {/* Shift Data Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shifts.length === 0 ? (
          <p className="text-center text-gray-500">No shifts found for this date</p>
        ) : (
          shifts.map((shift) => (
            <div key={shift._id} className="bg-white shadow-md p-5 rounded-lg">
              <h3 className="text-xl font-bold text-center">{shift.shiftType}</h3>
              <p className="text-center text-gray-600">{shift.date}</p>
              <p className="text-center font-medium text-indigo-600">
                {shift.startTime} - {shift.endTime}
              </p>

              <div className="mt-3">
                <p className="font-semibold">Supervisor: {shift.supervisor || "Not Assigned"}</p>
                <p className="font-semibold">Air Boy: {shift.airBoy || "Not Assigned"}</p>
              </div>

              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                    <th className="py-2 px-3 border">Nozzle</th>
                    <th className="py-2 px-3 border">Member</th>
                    <th className="py-2 px-3 border">Overtime</th>
                  </tr>
                </thead>
                <tbody>
                  {(shift.nozzles || []).map((nozzle, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition">
                      <td className="py-2 px-3 border text-center">{nozzle.nozzleNumber || "-"}</td>
                      <td className="py-2 px-3 border text-center">{nozzle.member || "Unassigned"}</td>
                      <td className="py-2 px-3 border text-center">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            nozzle.overtime
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {nozzle.overtime ? "Overtime ✅" : "❌ Overtime"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShiftList;
