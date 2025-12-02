import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaBriefcase, 
  FaPhone, 
  FaLock, 
  FaPlus, 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaTimes,
  FaSearch 
} from "react-icons/fa";

const AdminPanel = () => {
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    department: "manager",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  // --- EFFECTS ---
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- API CALLS ---
  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users");
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
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

  const handleAddUser = async () => {
    try {
      if (!formData.password) {
        return toast.error("Password is required for new user");
      }
      await axiosInstance.post("/signup", formData);
      toast.success("User added successfully");
      fetchUsers();
      setIsAddingUser(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

  const handleDeleteUser = async (userId) => {
    // Custom Toast for confirmation
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-800">Are you sure you want to delete this user?</p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => {
                deleteUserConfirmed(userId);
                closeToast();
              }}
              className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition"
            >
              Yes, Delete
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false, closeOnClick: false }
    );
  };

  const deleteUserConfirmed = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // --- HELPERS ---
  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      username: user.username,
      email: user.email,
      department: user.department || "manager",
      phone: user.phone || "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ username: "", email: "", department: "manager", phone: "", password: "" });
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDER HELPERS ---
  const DepartmentBadge = ({ dept }) => {
    const colors = {
      manager: "bg-purple-100 text-purple-800",
      "accounts/finance": "bg-green-100 text-green-800",
      backoffice: "bg-blue-100 text-blue-800",
      staff: "bg-gray-100 text-gray-800",
    };
    const colorClass = colors[dept?.toLowerCase()] || colors.staff;

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${colorClass}`}>
        {dept || "Staff"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-indigo-600 transition mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-500">Manage access and permissions for your team.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             {/* Search Bar */}
             <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2"
                />
             </div>

            <button
              onClick={() => { setIsAddingUser(true); resetForm(); }}
              className="flex items-center justify-center bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg transform active:scale-95"
            >
              <FaPlus className="mr-2" /> Add Member
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT: TABLE (Desktop) & CARDS (Mobile) */}
      <div className="max-w-7xl mx-auto">
        
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-xs text-gray-500">ID: {user._id.slice(-4)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-2">
                       <FaEnvelope className="text-gray-400 text-xs"/> {user.email}
                    </div>
                    {user.phone && (
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <FaPhone className="text-gray-400 text-xs"/> {user.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DepartmentBadge dept={user.department} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditClick(user)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-full mr-2 hover:bg-indigo-100 transition">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                 <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">No users found.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {user.username.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-800">{user.username}</h3>
                     <DepartmentBadge dept={user.department} />
                   </div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 border-t border-b border-gray-100 py-3">
                 <div className="flex items-center gap-2"><FaEnvelope className="text-gray-400"/> {user.email}</div>
                 <div className="flex items-center gap-2"><FaPhone className="text-gray-400"/> {user.phone || "N/A"}</div>
              </div>

              <div className="flex gap-3 mt-1">
                 <button onClick={() => handleEditClick(user)} className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-100 transition">
                   <FaEdit /> Edit
                 </button>
                 <button onClick={() => handleDeleteUser(user._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 py-2 rounded-lg font-medium hover:bg-red-100 transition">
                   <FaTrash /> Delete
                 </button>
              </div>
            </div>
          ))}
           {filteredUsers.length === 0 && (
             <div className="text-center py-8 text-gray-500">No users found.</div>
          )}
        </div>
      </div>

      {/* MODAL (Reusable for Add & Edit) */}
      {(isAddingUser || editingUser) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {isAddingUser ? "Add New Member" : "Edit User Details"}
              </h2>
              <button 
                onClick={() => { setIsAddingUser(false); setEditingUser(null); }}
                className="text-white hover:text-gray-200 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Username */}
              <div className="relative">
                 <FaUser className="absolute top-3 left-3 text-gray-400" />
                 <input
                   type="text"
                   name="username"
                   value={formData.username}
                   onChange={handleChange}
                   placeholder="Full Name"
                   className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                 />
              </div>

              {/* Email */}
              <div className="relative">
                 <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                 <input
                   type="email"
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                   placeholder="Email Address"
                   className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                 />
              </div>

              {/* Department */}
              <div className="relative">
                 <FaBriefcase className="absolute top-3 left-3 text-gray-400" />
                 <select
                   name="department"
                   value={formData.department}
                   onChange={handleChange}
                   className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white appearance-none"
                 >
                    <option value="manager">Manager</option>
                    <option value="accounts/finance">Accounts/Finance</option>
                    <option value="backoffice">Back Office</option>
                    <option value="staff">Staff</option>
                 </select>
              </div>

              {/* Phone */}
              <div className="relative">
                 <FaPhone className="absolute top-3 left-3 text-gray-400" />
                 <input
                   type="tel"
                   name="phone"
                   value={formData.phone}
                   onChange={handleChange}
                   placeholder="Phone Number"
                   className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                 />
              </div>

              {/* Password (Only show for Add User or explicitly changing it) */}
              {isAddingUser && (
                <div className="relative">
                   <FaLock className="absolute top-3 left-3 text-gray-400" />
                   <input
                     type="password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     placeholder="Password"
                     className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                   />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 flex gap-3 justify-end border-t border-gray-100">
               <button 
                 onClick={() => { setIsAddingUser(false); setEditingUser(null); }}
                 className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
               >
                 Cancel
               </button>
               <button 
                 onClick={isAddingUser ? handleAddUser : handleUpdateUser}
                 className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
               >
                 {isAddingUser ? "Create User" : "Save Changes"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;