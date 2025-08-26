import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center ">
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
