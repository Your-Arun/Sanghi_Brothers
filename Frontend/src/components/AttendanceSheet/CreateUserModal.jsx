import React from "react";

const CreateUserModal = ({ newUser, setNewUser, onClose, onSave }) => {
  if (!newUser) return null; // Avoid rendering without data

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewUser({ ...newUser, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center pr-6 z-50">
      <div className="bg-gray-900 text-white w-full max-w-md p-6 rounded-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-4 bg-transparent text-2xl text-red-400 hover:text-red-600">
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">➕ Create New User</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(newUser).map(([key, val]) => {
            if (key === "photo") return null;
            return (
              <input
                key={key}
                type={key === "password" ? "password" : "text"}
                placeholder={key}
                value={val}
                onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })}
                className="border border-gray-600 bg-gray-800 p-2 rounded text-white placeholder-gray-400"
              />
            );
          })}
          <input
            type="file"
            placeholder="Profile Photo"
            accept=".jpg, .jpeg, .png"
            onChange={handleFileChange}
            className="col-span-2 border bg-gray-800 text-white rounded p-2"
          />
        </div>
        <button
          onClick={onSave}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save User
        </button>
      </div>
    </div>
  );
};

export default CreateUserModal;
