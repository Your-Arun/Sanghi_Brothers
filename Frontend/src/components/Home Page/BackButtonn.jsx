import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded shadow flex items-center gap-2"
    >
      ← {label}
    </button>
  );
};

export default BackButton;
