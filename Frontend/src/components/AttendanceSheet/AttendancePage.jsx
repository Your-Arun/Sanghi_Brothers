import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";

const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    aadhaar: "",
    department: "",
    designation: "",
    joiningDate: "",
    salary: "",
    password: "",
    photo: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [month, year]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/users/attendance?month=${month}&year=${year}`);
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    const filtered = users.filter((u) =>
      u.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleCreateUser = async () => {
    try {
      await axiosInstance.post("/users", newUser);
      setShowCreate(false);
      fetchUsers();
      setNewUser({
        name: "", username: "", email: "", phone: "", address: "", aadhaar: "",
        department: "", designation: "", joiningDate: "", salary: "", password: "", photo: "",
      });
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-64"
        />

        <div className="flex gap-2">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border p-2 rounded">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border p-2 rounded">
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Create User
        </button>
      </div>

      {/* User Cards */}
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

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg overflow-y-auto max-h-[90vh] relative">
            <button onClick={() => setShowCreate(false)} className="absolute top-2 right-4 text-xl font-bold">&times;</button>
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(newUser).map(([key, val]) => (
                key !== "password" && (
                  <input
                    key={key}
                    type="text"
                    placeholder={key}
                    value={val}
                    onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })}
                    className="border p-2 rounded"
                  />
                )
              ))}
            </div>
            <button
              onClick={handleCreateUser}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Save User
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg overflow-y-auto max-h-[90vh] relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-2 right-4 text-xl font-bold">&times;</button>
            <div className="flex gap-6 mb-4">
              <img src={selectedUser.photo || ""} alt={selectedUser.name} className="w-28 h-28 rounded-full object-cover" />
              <div>
                <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                <p className="text-gray-600">{selectedUser.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              <p><strong>Salary:</strong> ₹{selectedUser.salary}</p>
              <p><strong>Joining Date:</strong> {selectedUser.joiningDate}</p>
              <p><strong>Aadhaar No:</strong> {selectedUser.aadhaar}</p>
              <p><strong>Attendance Count:</strong> {selectedUser.attendance?.length || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
