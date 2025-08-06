import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";

const AttendanceTablePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const daysInMonth = new Date(year, month, 0).getDate();

  const fetchMonthlyAttendance = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/monthly-attendance?month=${String(month).padStart(2, "0")}&year=${year}`);
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
  }, [month, year]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">📅 Monthly Attendance Table</h1>

      {/* Filters */}
      <div className="flex gap-4 items-center mb-6">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>{y}</option>
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
          onClick={fetchMonthlyAttendance}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Table or Message */}
      <div className="overflow-auto rounded border border-gray-700">
        {loading ? (
          <div className="text-center py-10 text-xl">⏳ Loading attendance data...</div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-10 text-red-400 text-xl">
            🚫 No attendance data for {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="border border-gray-700 px-2 py-1 sticky left-0 bg-gray-800 z-20">Name</th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i} className="border border-gray-700 px-1 text-center">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((user, idx) => (
                <tr key={idx}>
                  <td className="text-white border border-gray-700 px-2 py-1 sticky left-0 bg-gray-900 z-10 whitespace-nowrap">
                    {user.name}
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                    const status = user.attendance[date];
                    let display = "❌";
                    if (status === "Present") display = "✅";
                    else if (status === "Leave") display = "🟡";

                    return (
                      <td key={i} className="border border-gray-700 px-1 text-center text-xs">
                        {status ? display : "❌"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceTablePage;
