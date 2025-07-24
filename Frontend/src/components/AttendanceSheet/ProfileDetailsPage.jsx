import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Dashboard/axiosInstance";

const ProfileDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={user.photo || ""}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p>{user.designation}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Department:</strong> {user.department}</p>
        <p><strong>Joining Date:</strong> {user.joiningDate}</p>
        <p><strong>Salary:</strong> ₹{user.salary}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Aadhaar No:</strong> {user.aadhaar}</p>
        <p><strong>Username:</strong> {user.username}</p>
      </div>
    </div>
  );
};

export default ProfileDetailsPage;
