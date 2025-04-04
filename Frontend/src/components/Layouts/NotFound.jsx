import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="max-w-3xl flex flex-col md:flex-row items-center gap-8">
        {/* Image */}
        <img
          src="https://upload.wikimedia.org/wikipedia/en/2/23/Mike_Wazowski.png"
          alt="404 Not Found"
          className="w-60 md:w-72"
        />

        {/* Text Content */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            OOPS! PAGE NOT FOUND.
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            You must have picked the wrong door because I haven't been able to
            lay my eye on the page you've been searching for.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-600 text-white text-lg font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>

      {/* Footer with Social Icons */}
      <div className="mt-12 text-gray-600 text-sm text-center">
        <p>Follow us on:</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="text-gray-600 hover:text-black text-xl">
            🔵
          </a>
          <a href="#" className="text-gray-600 hover:text-black text-xl">
            ⚫
          </a>
          <a href="#" className="text-gray-600 hover:text-black text-xl">
            ❌
          </a>
          <a href="#" className="text-gray-600 hover:text-black text-xl">
            ▶️
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
