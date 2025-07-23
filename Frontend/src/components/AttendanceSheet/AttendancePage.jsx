import React, { useState, useEffect } from "react";
import { Calendar, PlusCircle, Search } from "lucide-react";
import AddUserModal from "./AddUserModal";
import axiosInstance from "../Dashboard/axiosInstance";

const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchUsers();
  }, [month, year]);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get(`/attendance/all?month=${month}&year=${year}`);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter((user) => user.name.toLowerCase().includes(term))
    );
  };

  const handleAddUser = async (newUser) => {
    try {
      const { data } = await axiosInstance.post("/users", newUser);
      setUsers([...users, data]);
      setShowAddModal(false);
    } catch (err) {
      console.error("Add user failed", err);
    }
  };

  const attendanceSummary = (user) => {
    const { attendance } = user;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    return `${present}P / ${absent}A`;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search user"
            className="px-4 py-2 rounded border w-[200px]"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          <PlusCircle size={18} /> Create User
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded shadow hover:shadow-lg p-4 cursor-pointer"
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user.photo || "/placeholder.png"}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            />
            <h2 className="text-center font-semibold text-lg">{user.name}</h2>
            <p className="text-center text-sm text-gray-600">
              {user.designation}
            </p>
            <p className="text-center mt-2 text-blue-600 font-medium">
              {attendanceSummary(user)}
            </p>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl shadow-lg relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-600"
            >
              &times;
            </button>
            <div className="flex gap-6">
              <img
                src={selectedUser.photo || "/placeholder.png"}
                alt={selectedUser.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                <p>{selectedUser.designation}</p>
                <p>{selectedUser.address}</p>
                <p>Aadhaar: {selectedUser.aadhaar}</p>
                <p>Joined: {selectedUser.joiningDate?.split("T")[0]}</p>
                <p>Salary: ₹{selectedUser.salary}</p>
              </div>
            </div>
            <hr className="my-4" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Monthly Attendance</h3>
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Check-In</th>
                    <th className="p-2 border">Check-Out</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser.attendance.map((day, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{day.date.split("T")[0]}</td>
                      <td className="p-2 border">{day.checkIn || "-"}</td>
                      <td className="p-2 border">{day.checkOut || "-"}</td>
                      <td className="p-2 border capitalize">
                        {day.status || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onSubmit={handleAddUser} />
      )}
    </div>
  );
};

export default AttendancePage;
