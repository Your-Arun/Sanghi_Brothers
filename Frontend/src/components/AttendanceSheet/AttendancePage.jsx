import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
import CreateUserModal from "./CreateUserModal"; // Modal to add user
import ProfileModal from "./ProfileModal"; // Full profile + attendance
import MonthYearFilter from "./MonthYearFilter"; // Top filter

const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [year, month]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/users/attendance?month=${month}&year=${year}`);
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      console.error("Ye kaam nhh kr rha hai", err);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    const filtered = users.filter((u) =>
      u.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-[300px]"
        />
        <MonthYearFilter month={month} setMonth={setMonth} year={year} setYear={setYear} />
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </div>

      {/* Users Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user.photo || ""}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
            />
            <h3 className="text-center text-lg font-bold">{user.name}</h3>
            <p className="text-center text-sm text-gray-600">{user.designation || "N/A"}</p>
            <p className="text-center mt-2 text-green-600">
              Attendance: <strong>{user.attendance?.length || 0}</strong>
            </p>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}

      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          year={year}
          month={month}
        />
      )}
    </div>
  );
};

export default AttendancePage;
