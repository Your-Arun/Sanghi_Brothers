import React, { useState, useEffect } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
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
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await axiosInstance.get(`/getshifts?date=${formattedDate}`);
      const latestShifts = Array.isArray(response.data.shifts)
        ? response.data.shifts.slice(-2)
        : [];
      setShifts(latestShifts);
    } catch (error) {
      setShifts([]);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* 📅 Date Picker */}
      <div className="flex flex-col items-center mb-6">
        <label className="mb-2 text-lg font-semibold text-gray-700">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="p-2 border border-gray-400 rounded-md w-52 text-center"
          placeholderText="Please Select Date"
        />
      </div>

      {/* 🔄 Shift Data Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shifts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg font-medium">
            No shifts found for this date.
          </div>
        ) : (
          shifts.map((shift) => (
            <div key={shift._id} className="bg-white shadow-md rounded-lg p-5 relative">
              <h3 className="text-xl font-bold text-center">
                {shift.shiftType}
              </h3>
              <p className="text-center text-gray-600">
                📅 Date: <span className="font-medium">{shift.date}</span>
              </p>
              <p className="text-center font-medium text-indigo-600">
                🕒 Time: {shift.startTime} - {shift.endTime}
              </p>

              <div className="flex justify-evenly mt-3">
              <p className="font-semibold">Supervisor <span className="text-red-800"> {shift.supervisor || "Not Assigned"}</span></p>
                <p className="font-semibold">Extra Operator <span className="text-red-800">{shift.extraOperator}</span></p>
                <p className="font-semibold">Air Boy <span className="text-red-800">{shift.airBoy || "Not Assigned"}</span></p>
              </div>

              {/* Nozzle Table */}
              <div className="overflow-x-auto">
             <table className="w-full min-w-[300px] table-fixed border border-gray-300 text-sm rounded-lg">
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
                      <td className="py-2 px-3 border text-center">
                        {nozzle.nozzleNumber || "-"}
                      </td>
                      <td className="py-2 px-3 border text-center">
                        {nozzle.member || "Unassigned"}
                      </td>
                      <td className="py-2 px-3 border text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            nozzle.overtime
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {nozzle.overtime ? "Overtime ✅" : "No Overtime"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShiftList;
