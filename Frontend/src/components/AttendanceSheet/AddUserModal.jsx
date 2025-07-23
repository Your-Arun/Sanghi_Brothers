import React, { useState } from "react";

const AddUserModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    address: "",
    aadhaar: "",
    joiningDate: "",
    salary: "",
    photo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Name" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input name="designation" placeholder="Designation" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input name="address" placeholder="Address" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input name="aadhaar" placeholder="Aadhaar No." className="w-full p-2 border rounded" onChange={handleChange} required />
          <input name="joiningDate" type="date" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input name="salary" type="number" placeholder="Salary" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input name="photo" placeholder="Photo URL" className="w-full p-2 border rounded" onChange={handleChange} />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Save User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
