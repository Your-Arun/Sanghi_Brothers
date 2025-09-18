import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SuperAdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    department: "",
    photo: "",
    address: "",
    aadhaar: "",
    designation: "",
    joiningDate: "",
    salary: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users");
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      department: user.department || "",
      photo: user.photo || "",
      address: user.address || "",
      aadhaar: user.aadhaar || "",
      designation: user.designation || "",
      joiningDate: user.joiningDate ? user.joiningDate.split("T")[0] : "",
      salary: user.salary || "",
      role: user.role || "user",
      password: "", // password change अलग से करेंगे
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    try {
      await axiosInstance.put(`/users/${editingUser}`, formData);
      toast.success("User updated successfully");
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        toast.success("User deleted");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleAddUser = async () => {
    try {
      if (!formData.password) {
        return toast.error("Password is required for new user");
      }
      await axiosInstance.post("/signup", formData);
      toast.success("User added successfully");
      fetchUsers();
      setIsAddingUser(false);
      setFormData({
        name: "",
        username: "",
        email: "",
        phone: "",
        department: "",
        photo: "",
        address: "",
        aadhaar: "",
        designation: "",
        joiningDate: "",
        salary: "",
        password: "",
        role: "user",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-700 transition"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
        🛡 Super Admin Panel
      </h1>

      {/* User Table */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">All Users</h2>
          <button
            onClick={() => setIsAddingUser(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + Add User
          </button>
        </div>

        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-blue-500 text-white text-center">
              <th className="p-2">Name</th>
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Department</th>
              <th className="p-2">Designation</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b text-center">
                <td>{user.name || "N/A"}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.department}</td>
                <td>{user.designation || "N/A"}</td>
                <td>{user.salary || "N/A"}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(isAddingUser || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 w-11/12 sm:w-96 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold text-center mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h2>

            {[
              { name: "name", type: "text", placeholder: "Full Name" },
              { name: "username", type: "text", placeholder: "Username" },
              { name: "email", type: "email", placeholder: "Email" },
              { name: "phone", type: "tel", placeholder: "Phone" },
              { name: "department", type: "text", placeholder: "Department" },
              { name: "photo", type: "text", placeholder: "Photo URL" },
              { name: "address", type: "text", placeholder: "Address" },
              { name: "aadhaar", type: "text", placeholder: "Aadhaar No." },
              { name: "designation", type: "text", placeholder: "Designation" },
              { name: "joiningDate", type: "date", placeholder: "Joining Date" },
              { name: "salary", type: "number", placeholder: "Salary" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full mb-2 p-2 border rounded"
              />
            ))}

            {!editingUser && (
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full mb-2 p-2 border rounded"
              />
            )}

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>

            <div className="flex justify-between">
              <button
                onClick={() =>
                  editingUser ? setEditingUser(null) : setIsAddingUser(false)
                }
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingUser ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;
