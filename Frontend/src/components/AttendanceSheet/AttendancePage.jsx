import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import UserContext from "../Home Page/UserContext";
import AttendanceTablePage from "./AttendanceTablePage";


const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);



  const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const days = getDaysInMonth(year, month);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/users/attendance?month=${month}&year=${year}`);
      const data = res.data || [];
      setUsers(data);
      setAttendanceData(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [month, year]);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "name-asc") return a.name?.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name?.localeCompare(a.name);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const filteredUsers = sortedUsers.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSaveUser = async () => {
    try {
      await axiosInstance.post("/users", newUser);
      fetchUsers();
      setShowCreateModal(false);
      setNewUser(null);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧑‍💼 Attendance Management</h1>
        {currentUser?.department === "manager" && (
          <button
            onClick={() => { navigate("/create-user") }}
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
        <button
          onClick={fetchUsers}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          🔄 Refresh
        </button>
        <button
          onClick={() => navigate("/daily-log-view")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          📖 Daily Log View
        </button>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {user.attendance?.filter((a) =>
                      a.date?.startsWith(`${year}-${String(month).padStart(2, "0")}`)
                    ).length || 0}{" "}
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
          onUserUpdated={fetchUsers}
        />
      )}

      <AttendanceTablePage />
    </div>
  );
};

export default AttendancePage;
