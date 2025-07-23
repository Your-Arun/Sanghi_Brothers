import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";


const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    address: "",
    aadhaar: "",
    designation: "",
    joiningDate: "",
    salary: "",
    photo: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axiosInstance.get("/users");
    setUsers(res.data);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/users", newUser);
    setShowModal(false);
    setNewUser({ name: "", address: "", aadhaar: "", designation: "", joiningDate: "", salary: "", photo: "" });
    fetchUsers();
  };

  const calculateSummary = (attendance) => {
    const presentDays = attendance.length;
    const totalDays = new Date().getDate(); // Approx
    const absentDays = totalDays - presentDays;
    return { presentDays, absentDays };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Employee Attendance</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add User
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => {
          const { presentDays, absentDays } = calculateSummary(user.attendance || []);
          return (
            <div
              key={user._id}
              className="bg-white shadow rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.photo || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border"
                />
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.designation}</p>
                </div>
              </div>

              <div className="text-sm text-gray-700 mb-2">
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Aadhaar:</strong> {user.aadhaar}</p>
                <p><strong>Joining:</strong> {user.joiningDate}</p>
                <p><strong>Salary:</strong> ₹{user.salary}</p>
              </div>

              <div className="mt-2 text-sm text-gray-700">
                <p><strong>Present:</strong> {presentDays} days</p>
                <p><strong>Absent:</strong> {absentDays} days</p>
              </div>

              <table className="w-full mt-3 text-xs">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-1">Date</th>
                    <th className="p-1">Check-In</th>
                    <th className="p-1">Check-Out</th>
                  </tr>
                </thead>
                <tbody>
                  {(user.attendance || []).map((a, i) => (
                    <tr key={i} className="text-center border-t">
                      <td className="p-1">{a.date}</td>
                      <td className="p-1">{a.checkIn}</td>
                      <td className="p-1">{a.checkOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <form
            onSubmit={handleAddUser}
            className="bg-white p-6 rounded-lg w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-bold mb-2">Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              className="input"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="input"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
            />
            <input
              type="text"
              placeholder="Aadhaar No."
              className="input"
              value={newUser.aadhaar}
              onChange={(e) => setNewUser({ ...newUser, aadhaar: e.target.value })}
            />
            <input
              type="text"
              placeholder="Designation"
              className="input"
              value={newUser.designation}
              onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
            />
            <input
              type="date"
              placeholder="Joining Date"
              className="input"
              value={newUser.joiningDate}
              onChange={(e) => setNewUser({ ...newUser, joiningDate: e.target.value })}
            />
            <input
              type="number"
              placeholder="Salary"
              className="input"
              value={newUser.salary}
              onChange={(e) => setNewUser({ ...newUser, salary: e.target.value })}
            />
            <input
              type="text"
              placeholder="Photo URL (optional)"
              className="input"
              value={newUser.photo}
              onChange={(e) => setNewUser({ ...newUser, photo: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
