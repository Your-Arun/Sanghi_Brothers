import React, { useState, useEffect } from "react";
import axiosInstance from "../Dashboard/axiosInstance";

const DailyLogView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
    setLoading(false);
  };

  const handleAttendanceChange = (userId, status) => {
    setAttendanceData((prev) => ({ ...prev, [userId]: status }));
  };

  const handleSubmitAttendance = async () => {
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const payload = Object.entries(attendanceData).map(([userId, status]) => ({
        userId,
        date: dateStr,
        status,
      }));
      await axiosInstance.post("/mark-attendance", payload);
      alert("✅ Attendance submitted successfully.");
    } catch (err) {
      console.error("Submit failed:", err);
      alert("❌ Error submitting attendance.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">📝 Daily Attendance</h2>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
        />
        <input
          type="text"
          placeholder="🔍 Search user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded text-white w-64 border border-gray-700"
        />
        <button
          onClick={handleSubmitAttendance}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-semibold"
        >
          ✅ Submit Attendance
        </button>
      </div>

      {/* User Cards */}
      {loading ? (
        <p className="text-gray-400">⏳ Loading users...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-gray-800 border border-gray-700 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-600"
                />
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-400 text-sm">{user.designation}</p>
                </div>
              </div>

              {/* Attendance Buttons */}
              <div className="mt-4 flex gap-3 flex-wrap">
                {["Present", "Absent", "Leave"].map((status) => {
                  const isSelected = attendanceData[user._id] === status;
                  const bgColor =
                    status === "Present"
                      ? isSelected
                        ? "bg-green-400"
                        : "bg-green-800"
                      : status === "Absent"
                      ? isSelected
                        ? "bg-red-400"
                        : "bg-red-800"
                      : isSelected
                      ? "bg-yellow-400"
                      : "bg-yellow-700";

                  return (
                    <button
                      key={status}
                      onClick={() => handleAttendanceChange(user._id, status)}
                      className={`px-4 py-1 rounded-full text-sm font-medium text-white ${bgColor} hover:opacity-90`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyLogView;
