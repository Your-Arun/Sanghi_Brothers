// DesktopOnlyMessage.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const DesktopOnlyMessage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    }
  }, []);

  if (!isMobile) return null; // Agar mobile nahi hai to kuch render na kare

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm text-center border border-yellow-200">
        {/* Icon circle */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <span className="text-3xl">💻</span>
        </div>

        {/* Title */}
        <h2 className="mt-12 text-2xl font-extrabold text-gray-800">
          Desktop Only Feature
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-gray-600 leading-relaxed">
          Ye feature sirf{" "}
          <span className="font-semibold text-yellow-600">desktop screen</span>{" "}
          par available hai.
          Apne device ko desktop mode me open kare.
        </p>

        {/* Illustration */}
        <div className="mt-5 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
            alt="Desktop Icon"
            className="w-20 h-20 opacity-90"
          />
        </div>

        {/* Button */}
        <button
          onClick={() => toast.warn("Try opening on desktop!")}
          className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg shadow-md transition"
        >
          Okay, Got It!
        </button>
      </div>
    </div>
  );
};

export default DesktopOnlyMessage;
