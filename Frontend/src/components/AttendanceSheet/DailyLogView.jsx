import React, { useState, useEffect } from "react";
import axiosInstance from "../Dashboard/axiosInstance"; // ✅ Make sure axiosInstance is properly configured
import "react-datepicker/dist/react-datepicker.css";

const DailyLogView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
    setLoading(false);
  };

  const handleAttendanceChange = (userId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [userId]: status,
    }));
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
    } catch (error) {
      console.error("Failed to submit attendance:", error);
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
    <div className="p-6 bg-gray-800 min-h-screen rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">📝 Daily Manual Attendance</h2>

      {/* Top controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Search user..."
          className="bg-gray-700 px-4 py-2 rounded text-white w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={handleSubmitAttendance}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-semibold"
        >
          ✅ Submit Attendance
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading users...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-gray-900 border border-gray-700 p-4 rounded-lg flex items-start gap-4"
            >
              <img
                src={user.photo}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                <p className="text-gray-400 text-sm">{user.designation}</p>

                <div className="mt-2 flex gap-3">
                  {["Present", "Absent", "Leave"].map((status) => (
                    <label key={status} className="flex items-center gap-1 text-sm text-white">
                      <input
                        type="radio"
                        name={`attendance-${user._id}`}
                        value={status}
                        checked={attendanceData[user._id] === status}
                        onChange={() => handleAttendanceChange(user._id, status)}
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyLogView;
