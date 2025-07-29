import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
import CreateUserModal from "./CreateUserModal";
import ProfileModal from "./ProfileModal";

const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/users/attendance?month=${month}&year=${year}`);
      setUsers(res.data || []);
      setAttendanceData(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [month, year]);

  const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const days = getDaysInMonth(year, month);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🧑‍💼 Attendance Management</h1>

      {/* Search + Filter + Add User */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search user..."
          className="bg-gray-700 px-4 py-2 rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={year}
          onChange={(e) => setYear(+e.target.value)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(+e.target.value)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <button
          onClick={fetchUsers}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          🔍 Search
        </button>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add User
        </button>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={user.photo || ""}
                alt="User"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-400">{user.designation}</p>
                <p className="text-sm mt-1">
                  Attendance:{" "}
                  {user.attendance?.filter((a) =>
                    a.date.startsWith(`${year}-${String(month).padStart(2, "0")}`)
                  ).length || 0}{" "}
                  days
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="mt-10 bg-gray-900 p-4 rounded-lg shadow text-white">
        <h2 className="text-2xl font-bold mb-4">📅 Monthly Attendance Table</h2>

        <div className="overflow-auto border border-gray-700 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="border border-gray-700 px-2 py-1 text-left">Name</th>
                {[...Array(days)].map((_, i) => (
                  <th key={i} className="border border-gray-700 px-2 text-center">
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
                    <td className="border border-gray-700 px-2 py-1">{user.name}</td>
                    {[...Array(days)].map((_, i) => {
                      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                      const present = attendance.some((a) => a.date?.startsWith(dateStr));
                      return (
                        <td key={i} className="border border-gray-700 text-center">
                          {present ? "✅" : "❌"}
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

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onUserCreated={fetchUsers}
        />
      )}
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={fetchUsers}
        />
      )}
    </div>
  );
};

export default AttendancePage;
