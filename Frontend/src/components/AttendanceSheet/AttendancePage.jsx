import React, { useContext, useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import UserContext from "../Home Page/UserContext";
import AttendanceTablePage from "./AttendanceTablePage";
import axiosInstance from "../Dashboard/axiosInstance";

const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceTableData, setAttendanceTableData] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const usersRes = await axiosInstance.get(`/users/attendance?month=${month}&year=${year}`);
      setUsers(usersRes.data || []);

      const dateString = `${year}-${String(month).padStart(2, "0")}`;
      const attendanceRes = await axiosInstance.get(`/daily-attendance?date=${dateString}`);
      setAttendanceTableData(attendanceRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [month, year]);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "name-asc") return a.name?.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name?.localeCompare(a.name);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const filteredUsers = sortedUsers.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧑‍💼 Attendance Management</h1>
        {currentUser?.department === "manager" && (
          <button
            onClick={() => navigate("/create-user")}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add User
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search user..."
          className="bg-gray-700 px-4 py-2 rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          <option value="recent">📅 Recently Added</option>
          <option value="name-asc">🔤 Name (A-Z)</option>
          <option value="name-desc">🔡 Name (Z-A)</option>
        </select>

        {/* <select
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
        </select> */}

        <button onClick={fetchAllData} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded">
          🔄 Refresh
        </button>
        <button
          onClick={() => navigate("/daily-log-view")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          📖 Daily Log View
        </button>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading ? (
          <p className="text-center col-span-full text-gray-400">⏳ Loading users...</p>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.photo || "/user-avatar.png"}
                  alt="User"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-400">{user.designation}</p>
                  <p className="text-sm mt-1">
                    Attendance:{" "}
                    {
                      user.attendance?.filter((a) =>
                        a.date?.startsWith(`${year}-${String(month).padStart(2, "0")}`)
                      ).length || 0
                    }{" "}
                    days
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">❌ No matching users.</p>
        )}
      </div>

      {/* Modals */}
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={fetchAllData}
        />
      )}

      {/* Attendance Table Component */}
      <AttendanceTablePage data={attendanceTableData} loading={loading} />    </div>
  );
};

export default AttendancePage;
