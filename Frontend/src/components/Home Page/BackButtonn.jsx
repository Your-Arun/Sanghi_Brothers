import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center mt-10 mb-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md flex items-center gap-2"
      >
        ← {label}
      </button>
    </div>
  );
};

export default BackButton;
