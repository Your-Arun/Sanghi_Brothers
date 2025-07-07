import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    department: "manager",
    phone: "",
    password: "",
  });
  const confirmDeleteToast = (onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this ?</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                onConfirm()
                closeToast()
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    )
  }

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
      username: user.username,
      email: user.email,
      department: user.department || "",
      phone: user.phone || "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    try {
      await axiosInstance.put(`/users/${editingUser}`, formData);
      toast.success("User  updated successfully");
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteUser = async (userId) => {
    confirmDeleteToast(async () => {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        toast.success("User  deleted");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    })
  }

  const handleAddUser = async () => {
    try {
      if (!formData.password) {
        return toast.error("Password is required for new user");
      }
      await axiosInstance.post("/signup", formData);
      toast.success("User  added successfully");
      fetchUsers();
      setIsAddingUser(false);
      setFormData({ username: "", email: "", department: "manager", phone: "", password: "" });
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

      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-6">
        Admin Panel - Manage Users
      </h1>

      <div className="w-full mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg sm:text-xl font-bold">Users List</h2>
          <button
            onClick={() => setIsAddingUser(true)}
            className="bg-green-500 text-white px-4 py-2 rounded text-sm sm:text-base"
          >
            + Add Member
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base border">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Department</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b text-center">
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.department || "N/A"}</td>
                  <td className="p-2">{user.phone || "N/A"}</td>
                  <td className="p-2 space-x-2">
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
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 w-11/12 sm:w-96 rounded-lg shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-center mb-4">Edit User</h2>
            <input type="text" name="username" value={formData.username} onChange={handleChange}
              className="w-full mb-2 p-2 border rounded" placeholder="Username" />
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full mb-2 p-2 border rounded" placeholder="Email" />
            <input type="text" name="department" value={formData.department} onChange={handleChange}
              className="w-full mb-2 p-2 border rounded" placeholder="Department" />
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full mb-4 p-2 border rounded" placeholder="Phone" />
            <div className="flex justify-between">
              <button onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleUpdateUser} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 w-11/12 sm:w-96 rounded-lg shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-center mb-4">Add Member</h2>
            <input type="text" name="username" value={formData.username} onChange={handleChange}
              className="w-full mb-2 p-2 border rounded" placeholder="Username" />
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full mb-2 p-2 border rounded" placeholder="Email" />
            <select name="department" value={formData.department} onChange={handleChange}
              className="w-full mb-2 p-2 border rounded">
              <option value="manager">Manager</option>
              <option value="accounts/finance">Accounts/Finance</option>
              <option value="backoffice">Back Office</option>
              <option value="staff">Staff</option>
            </select>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full mb-2 p-2 border rounded" placeholder="Phone Number" />
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full mb-4 p-2 border rounded" placeholder="Password" />
            <div className="flex justify-between">
              <button onClick={() => setIsAddingUser(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAddUser} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default AdminPanel;