import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";

const AttendanceTablePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchAttendance = async () => {
    try {
      const res = await axiosInstance.get(`/users/attendance?month=${month}&year=${year}`);
      setAttendanceData(res.data || []);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const days = getDaysInMonth(year, month);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">📅 Monthly Attendance Table</h1>

      {/* Filter Controls */}
      <div className="flex gap-4 items-center mb-6">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <button
          onClick={fetchAttendance}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Attendance Table */}
      <div className="overflow-auto rounded border border-gray-700">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-gray-700 px-2 py-1 sticky left-0 bg-gray-800">Name</th>
              {Array.from({ length: days }, (_, i) => (
                <th key={i} className="border border-gray-700 px-1 text-center">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((user, idx) => {
              const attendance = user.attendance || [];
              return (
                <tr key={idx}>
                  <td className="border border-gray-700 px-2 py-1 sticky left-0 bg-gray-900 z-10 whitespace-nowrap">
                    {user.name}
                  </td>
                  {Array.from({ length: days }, (_, i) => {
                    const day = String(i + 1).padStart(2, "0");
                    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${day}`;
                    const isPresent = attendance.some(
                      (entry) => entry.date && entry.date.startsWith(formattedDate)
                    );
                    return (
                      <td
                        key={i}
                        className="border border-gray-700 px-1 text-center text-xs"
                      >
                        {isPresent ? "✅" : "❌"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTablePage;
