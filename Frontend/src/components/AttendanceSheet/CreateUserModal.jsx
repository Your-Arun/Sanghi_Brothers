import React from "react";

const CreateUserModal = ({ formData, setFormData, onClose, onSubmit }) => {
  const fields = [
    "name", "username", "email", "phone", "password", "department",
    "address", "aadhaar", "designation", "joiningDate", "salary", "photo"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-2xl rounded-lg p-6 overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-xl font-bold">
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <input
              key={field}
              type={field === "photo" ? "url" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border px-3 py-2 rounded"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          ))}
        </div>
        <button
          onClick={onSubmit}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateUserModal;
