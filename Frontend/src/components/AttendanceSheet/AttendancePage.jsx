import React, { useState } from "react";
import { Plus } from "lucide-react";

const dummyUser = {
  name: "John Doe",
  address: "123 Main St, City",
  aadhaar: "1234-5678-9012",
  designation: "Software Engineer",
  joiningDate: "2022-01-01",
  salary: "₹60,000",
  photo: "https://randomuser.me/api/portraits/men/75.jpg",
  attendance: [
    { date: "2025-07-20", checkIn: "09:05", checkOut: "18:00", status: "Present" },
    { date: "2025-07-21", checkIn: "", checkOut: "", status: "Absent" },
    { date: "2025-07-22", checkIn: "09:10", checkOut: "18:10", status: "Present" },
  ],
};

const AttendancePage = () => {
  const [user, setUser] = useState(dummyUser);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalDays = user.attendance.length;
  const presentDays = user.attendance.filter(a => a.status === "Present").length;
  const absentDays = totalDays - presentDays;

  const [newUser, setNewUser] = useState({
    name: "",
    address: "",
    aadhaar: "",
    designation: "",
    joiningDate: "",
    salary: "",
    photo: "",
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    setUser({ ...newUser, attendance: [] });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">Employee Attendance</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="mr-2" size={20} /> Add User
        </button>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <img src={user.photo} alt="Profile" className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Aadhaar No.:</strong> {user.aadhaar}</p>
          <p><strong>Designation:</strong> {user.designation}</p>
          <p><strong>Date of Joining:</strong> {user.joiningDate}</p>
          <p><strong>Salary:</strong> {user.salary}</p>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="mt-6 bg-white p-4 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-2">Monthly Summary (July 2025)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <h4 className="text-lg font-semibold">Total Days</h4>
            <p className="text-2xl">{totalDays}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <h4 className="text-lg font-semibold">Present</h4>
            <p className="text-2xl">{presentDays}</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow text-center">
            <h4 className="text-lg font-semibold">Absent</h4>
            <p className="text-2xl">{absentDays}</p>
          </div>
        </div>
      </div>

      {/* Daily Attendance Table */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Daily Attendance</h3>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Check-in</th>
              <th className="py-2 px-4 border">Check-out</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {user.attendance.map((att, idx) => (
              <tr key={idx} className="text-center">
                <td className="py-2 px-4 border">{att.date}</td>
                <td className="py-2 px-4 border">{att.checkIn || "--"}</td>
                <td className="py-2 px-4 border">{att.checkOut || "--"}</td>
                <td className={`py-2 px-4 border ${att.status === "Present" ? "text-green-600" : "text-red-500"}`}>
                  {att.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-4 text-gray-500 text-xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" required className="input" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
              <input type="text" placeholder="Address" required className="input" value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
              <input type="text" placeholder="Aadhaar No." required className="input" value={newUser.aadhaar} onChange={e => setNewUser({ ...newUser, aadhaar: e.target.value })} />
              <input type="text" placeholder="Designation" required className="input" value={newUser.designation} onChange={e => setNewUser({ ...newUser, designation: e.target.value })} />
              <input type="date" placeholder="Joining Date" required className="input" value={newUser.joiningDate} onChange={e => setNewUser({ ...newUser, joiningDate: e.target.value })} />
              <input type="text" placeholder="Salary" required className="input" value={newUser.salary} onChange={e => setNewUser({ ...newUser, salary: e.target.value })} />
              <input type="url" placeholder="Photo URL" required className="input col-span-2" value={newUser.photo} onChange={e => setNewUser({ ...newUser, photo: e.target.value })} />
              <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add User</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
