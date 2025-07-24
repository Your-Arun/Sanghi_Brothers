import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Dashboard/axiosInstance";

const UserCardsPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search bar */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by name"
          className="border px-4 py-2 rounded w-full md:w-[300px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={user.photo || ""}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
            />
            <h3 className="text-center text-lg font-bold">{user.name}</h3>
            <p className="text-center text-sm text-gray-600">
              {user.designation || "N/A"}
            </p>
            <button
              onClick={() => navigate(`/profile/${user._id}`)}
              className="block mt-4 mx-auto bg-blue-600 text-white px-4 py-2 rounded"
            >
              Profile Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCardsPage;
