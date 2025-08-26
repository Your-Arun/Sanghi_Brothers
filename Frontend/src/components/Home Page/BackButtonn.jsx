import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md flex items-center gap-2 mx-4"
      >
        ← {label}
      </button>
    </div>
  );
};

export default BackButton;
