import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";

const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    department: "",
    address: "",
    salary: "",
    dateOfJoining: "",
    aadhaar: "",
    photo: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [month, year]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/users?month=${month}&year=${year}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search)
  );

  const handleAddUser = async () => {
    try {
      await axiosInstance.post("/users", formData);
      setShowAddUserModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error adding user", err);
    }
  };

  return (
    <div className="p-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search user by name"
          className="border px-4 py-2 rounded w-full md:w-[250px]"
          value={search}
          onChange={handleSearchChange}
        />
        <div className="flex gap-2 items-center">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border px-4 py-2 rounded"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border px-4 py-2 rounded w-[100px]"
          />
        </div>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className="cursor-pointer border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={user.photo || "https://via.placeholder.com/100"}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
            />
            <h3 className="text-center font-bold">{user.name}</h3>
            <p className="text-center text-sm text-gray-600">
              {user.department}
            </p>
            <p className="text-center mt-2 text-green-600 font-semibold">
              Attendance: {user.attendanceCount || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-2xl rounded-lg p-6 overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-4 text-xl font-bold"
            >
              &times;
            </button>
            <div className="flex items-center gap-6 mb-4">
              <img
                src={selectedUser.photo || "https://via.placeholder.com/100"}
                alt={selectedUser.name}
                className="w-28 h-28 rounded-full object-cover"
              />
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
              <p><strong>Date of Joining:</strong> {selectedUser.dateOfJoining}</p>
              <p><strong>Aadhaar No:</strong> {selectedUser.aadhaar}</p>
              <p><strong>Attendance Count:</strong> {selectedUser.attendanceCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-2xl rounded-lg p-6 overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-2 right-4 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData).map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="border px-3 py-2 rounded"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                />
              ))}
            </div>
            <button
              onClick={handleAddUser}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
