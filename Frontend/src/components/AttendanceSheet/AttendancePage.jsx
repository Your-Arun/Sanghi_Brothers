import React, { useContext, useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import UserContext from "../Home Page/UserContext";
import AttendanceTablePage from "./AttendanceTablePage";
import axiosInstance from "../Dashboard/axiosInstance";
import BackButton from "../Home Page/BackButtonn";

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

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const usersPerPage = 6;

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const usersRes = await axiosInstance.get(
        `/users/attendance?month=${month}&year=${year}`
      );
      setUsers(usersRes.data || []);

      const dateString = `${year}-${String(month).padStart(2, "0")}`;
      const attendanceRes = await axiosInstance.get(
        `/daily-attendance?date=${dateString}`
      );
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

  // ✅ Pagination logic
  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      {/* Header */}
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

        <button
          onClick={fetchAllData}
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-black"
        >
          🔄 Refresh
        </button>
        <button
          onClick={() => navigate("/daily-log-view")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          📖 Daily Log View
        </button>
      </div>

      {/* User Cards with Pagination */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {loading ? (
          <p className="text-center col-span-full text-gray-400">
            ⏳ Loading users...
          </p>
        ) : paginatedUsers.length > 0 ? (
          paginatedUsers.map((user) => (
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
                  <p className="text-sm text-gray-400">{user.department}</p>
                  <p className="text-sm mt-1 text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            ❌ No matching users.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={fetchAllData}
        />
      )}

      {/* Attendance Table - always fill space */}
      <div className="flex-1 min-h-[80%]">
        <AttendanceTablePage data={attendanceTableData} loading={loading} />
      </div>

      <BackButton label="Go Back" />
    </div>
  );
};

export default AttendancePage;
