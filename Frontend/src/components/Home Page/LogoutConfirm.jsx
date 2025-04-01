import React from "react";

const LogoutConfirmation = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p className="text-gray-700 mb-6">
          Aap login page par ja rahe hain. Kya aap logout karna chahte hain?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
            onClick={() => onConfirm(true)}
          >
            Yes, Logout
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
            onClick={() => onConfirm(false)}
          >
            No, Stay Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
