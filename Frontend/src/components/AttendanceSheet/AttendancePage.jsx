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
    name: "", username: "", email: "", phone: "", address: "", aadhaar: "",
    department: "", designation: "", joiningDate: "", salary: "", password: "", photo: ""
  });

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/users/attendance?month=${month}&year=${year}`);
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTextSearch = (value) => {
    setSearch(value);
    const filtered = users.filter((u) =>
      u.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDateSearch = () => {
    fetchUsers(); // Refetch based on selected month/year
  };

  const handleCreateUser = async () => {
    const { username, email, phone, password } = newUser;
    if (!username || !email || !phone || !password) {
      alert("Fill required fields");
      return;
    }
    try {
      await axiosInstance.post("/users", newUser);
      setShowCreate(false);
      fetchUsers();
      setNewUser({
        name: "", username: "", email: "", phone: "", address: "", aadhaar: "",
        department: "", designation: "", joiningDate: "", salary: "", password: "", photo: ""
      });
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user.");
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen font-sans">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => handleTextSearch(e.target.value)}
          placeholder="🔍 Search employee"
          className="w-full md:w-80 px-4 py-2 border rounded-md shadow-sm"
        />
        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border px-3 py-2 rounded-md shadow-sm"
          >
            {[2023, 2024, 2025].map(y => <option key={y}>{y}</option>)}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border px-3 py-2 rounded-md shadow-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'short' })}
              </option>
            ))}
          </select>
          <button
            onClick={handleDateSearch}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            Search by Date
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* User Photo Cards */}
      <div className="flex overflow-x-auto gap-4 pb-4">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="min-w-[160px] bg-white shadow-md p-3 rounded-lg text-center hover:shadow-lg transition"
          >
            <img
              src={user.photo || ""}
              alt={user.name}
              className="w-16 h-16 mx-auto rounded-full object-cover border border-blue-200"
            />
            <h3 className="mt-2 font-semibold text-sm">{user.name}</h3>
            <p className="text-xs text-gray-500">{user.designation || "N/A"}</p>
            <button
              onClick={() => setSelectedUser(user)}
              className="mt-2 text-sm text-blue-600 border border-blue-500 px-3 py-1 rounded-md hover:bg-blue-50"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Designation</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Check-in</th>
              <th className="px-4 py-2">Checkout</th>
              <th className="px-4 py-2 text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.flatMap(user =>
              (user.attendance || []).map((att, idx) => (
                <tr key={idx} className="border-b hover:bg-blue-50">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img src={user.photo || ""} className="w-8 h-8 rounded-full" />
                    {user.name}
                  </td>
                  <td className="px-4 py-2">{user.designation}</td>
                  <td className="px-4 py-2">{att.date || "--"}</td>
                  <td className="px-4 py-2">{att.checkIn || "--"}</td>
                  <td className="px-4 py-2">{att.checkOut || "--"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-xl p-6 rounded-lg relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowCreate(false)} className="absolute top-2 right-4 text-xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(newUser).map(([key, val]) => (
                <input
                  key={key}
                  type={key === "password" ? "password" : "text"}
                  placeholder={key}
                  value={val}
                  onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })}
                  className="border p-2 rounded"
                />
              ))}
            </div>
            <button onClick={handleCreateUser} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              Save User
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-xl p-6 rounded-lg relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-2 right-4 text-xl">&times;</button>
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
              <p><strong>Aadhaar:</strong> {selectedUser.aadhaar}</p>
              <p><strong>Attendance:</strong> {selectedUser.attendance?.length || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
