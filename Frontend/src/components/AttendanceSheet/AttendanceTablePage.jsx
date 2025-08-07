import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../Dashboard/axiosInstance";

const AttendanceTablePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("a-z");

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

  const sortAttendanceData = (data) => {
    if (sortOption === "a-z") {
      return [...data].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "z-a") {
      return [...data].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "recent") {
      return [...data].sort((a, b) => (b._id > a._id ? 1 : -1));
    }
    return data;
  };

  const sortedData = sortAttendanceData(attendanceData);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">📅 Monthly Attendance Table</h1>

        {/* Date Picker + Refresh */}
        <div className="flex flex-wrap items-center gap-4 relative z-50 mb-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="bg-gray-700 text-white px-4 py-2 rounded"
          />
          <button
            onClick={fetchMonthlyAttendance}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            🔄 Refresh
          </button>

          {/* Sort Options */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            <option value="a-z">🔤 A - Z</option>
            <option value="z-a">🔡 Z - A</option>
            <option value="recent">🕒 Recently Added</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-xl">✅</span> Present
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">🟡</span> Leave
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-xl">❌</span> Absent
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-auto rounded border border-gray-700">
        {loading ? (
          <div className="text-center py-10 text-xl">⏳ Loading attendance data...</div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-10 text-red-400 text-xl">
            🚫 No attendance data for{" "}
            {new Date(year, month - 1).toLocaleString("default", { month: "long" })}{" "}
            {year}
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="border border-gray-700 px-2 py-1 sticky left-0 bg-gray-800 z-20">
                  Name
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i} className="border border-gray-700 px-1 text-center">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((user, idx) => (
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
