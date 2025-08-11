import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mt-6 mb-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded shadow flex items-center gap-2"
      >
        ← {label}
      </button>
    </div>
  );
};

export default BackButton;
