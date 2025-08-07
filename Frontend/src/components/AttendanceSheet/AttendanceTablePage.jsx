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
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-2">
          📅 Monthly Attendance Table
        </h1>
        {/* Date Picker + Refresh Button */}
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

      {/* Attendance Table or Messages */}
      <div className="overflow-auto rounded border border-gray-700 bg-white text-black">
        {loading ? (
          <div className="text-center py-10 text-xl text-gray-700">
            ⏳ Loading attendance data...
          </div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-10 text-red-600 text-lg font-semibold">
            🚫 No attendance data for{" "}
            {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
          </div>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-indigo-900 text-white sticky top-0 z-10">
              <tr>
                <th className="border border-gray-700 px-3 py-2 text-left sticky left-0 bg-indigo-900 z-20">
                  Name
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th
                    key={i}
                    className="border border-gray-700 px-2 py-1 text-center whitespace-nowrap"
                  >
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-3 py-2 sticky left-0 bg-white font-medium whitespace-nowrap z-10">
                    {user.name}
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = `${year}-${String(month).padStart(2, "0")}-${String(
                      i + 1
                    ).padStart(2, "0")}`;
                    const status = user.attendance[date];
                    let display = "❌";
                    if (status === "Present") display = "✅";
                    else if (status === "Leave") display = "🟡";

                    return (
                      <td
                        key={i}
                        className="border border-gray-300 px-2 py-1 text-center text-sm"
                      >
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
