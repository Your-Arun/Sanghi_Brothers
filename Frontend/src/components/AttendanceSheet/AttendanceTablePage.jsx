import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../Dashboard/axiosInstance";

const AttendanceTablePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate();

  const fetchMonthlyAttendance = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/monthly-attendance?month=${String(month).padStart(2, "0")}&year=${year}`
      );
      setAttendanceData(res.data || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [selectedDate]);

  return (
    <div className="p-4 sm:p-6 bg-gray-900 text-white min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-2">
          📅 Monthly Attendance Table
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="bg-white text-black px-4 py-2 rounded shadow"
            popperPlacement="bottom-start"
          />
          <button
            onClick={fetchMonthlyAttendance}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-indigo-900 text-white text-sm sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left border">Name</th>
              {Array.from({ length: totalDays }, (_, i) => (
                <th key={i} className="px-2 py-2 border text-center">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-black">
            {attendance.map((record, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="px-4 py-2 border font-medium">{record.name}</td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const status = record.days[i + 1];
                  return (
                    <td key={i} className="px-2 py-1 text-center border">
                      {status === "Present" ? (
                        <span className="text-green-600 font-bold">✅</span>
                      ) : (
                        <span className="text-red-500 font-bold">❌</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default AttendanceTablePage;
