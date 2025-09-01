import React, { useContext, useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import UserContext from "../Home Page/UserContext";
import AttendanceTablePage from "./AttendanceTablePage";
import axiosInstance from "../Dashboard/axiosInstance";
import BackButton from "../Home Page/BackButtonn";

const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [attendanceTableData, setAttendanceTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedUser, setSelectedUser] = useState(null);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const usersPerPage = 6;

  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);

  // ✅ Fetch users only
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get(
        `/users/attendance?month=${month}&year=${year}`
      );
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ✅ Fetch attendance only
  const fetchAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const dateString = `${year}-${String(month).padStart(2, "0")}`;
      const res = await axiosInstance.get(
        `/daily-attendance?date=${dateString}`
      );
      setAttendanceTableData(res.data || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAttendance();
  }, [month, year]);

  // ✅ Sorting
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "name-asc") return a.name?.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name?.localeCompare(a.name);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // ✅ Searching
  const filteredUsers = sortedUsers.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Pagination logic
  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // ✅ Dummy placeholders (so grid always stays balanced)
  const displayedUsers = [
    ...paginatedUsers,
    ...Array.from(
      { length: Math.max(0, usersPerPage - paginatedUsers.length) },
      () => null
    ),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide drop-shadow-lg mb-4 md:mb-0">
          🧑‍💼 Attendance Management
        </h1>
        {currentUser?.department === "manager" && (
          <button
            onClick={() => navigate("/create-user")}
            className="bg-gradient-to-r from-blue-500 to-blue-700 px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform font-semibold w-fit mx-auto md:mx-0"
          >
            ➕ Add User
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-8 bg-gray-800/70 p-4 rounded-xl shadow-lg backdrop-blur">
        <input
          type="text"
          placeholder="🔍 Search user..."
          className="bg-gray-700 px-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 px-4 py-2 rounded-lg"
        >
          <option value="recent">📅 Recently Added</option>
          <option value="name-asc">🔤 Name (A-Z)</option>
          <option value="name-desc">🔡 Name (Z-A)</option>
        </select>

        <button
          onClick={() => {
            fetchUsers();
            fetchAttendance();
          }}
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-black font-semibold shadow-md"
        >
          🔄 Refresh
        </button>

        <button
          onClick={() => navigate("/daily-log-view")}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-105 px-4 py-2 rounded-lg shadow-md transition-transform"
        >
          📖 Daily Log View
        </button>
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loadingUsers ? (
          <p className="text-center col-span-full text-gray-400">
            ⏳ Loading users...
          </p>
        ) : displayedUsers.length > 0 ? (
          displayedUsers.map((user, idx) =>
            user ? (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="bg-gray-800/80 rounded-2xl p-5 cursor-pointer hover:scale-105 hover:shadow-2xl transition transform backdrop-blur-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.photo || "/user-avatar.png"}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{user.name}</h2>
                    <p className="text-sm text-gray-400">{user.department}</p>
                    <p className="text-sm mt-1 text-gray-400">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={idx}
                className="bg-gray-700/40 rounded-2xl p-5 opacity-30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-600"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-600 mb-2 rounded"></div>
                    <div className="h-3 w-16 bg-gray-600 mb-1 rounded"></div>
                    <div className="h-3 w-20 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <p className="text-center col-span-full text-gray-400">
            ❌ No matching users.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mb-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 shadow-md"
          >
            ⬅️ Prev
          </button>
          <span className="px-4 py-2 bg-gray-800 rounded-lg shadow-md">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 shadow-md"
          >
            Next ➡️
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={() => {
            fetchUsers();
            fetchAttendance();
          }}
        />
      )}

      {/* Attendance Table */}
      <div className="flex-1 min-h-[100%] bg-gray-800/70 p-4 rounded-xl shadow-xl backdrop-blur">
        <AttendanceTablePage
          data={attendanceTableData}
          loading={loadingAttendance}
        />
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <BackButton label="⬅ Go Back" />
      </div>
    </div>
  );
};

export default AttendancePage;
