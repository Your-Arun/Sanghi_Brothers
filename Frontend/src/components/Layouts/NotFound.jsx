import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTelegramPlane, FaTwitter } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 p-6 relative overflow-hidden">

      {/* Floating background circles */}
      <div className="absolute w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse bottom-10 right-10"></div>

      {/* Main Content */}
      <div className="max-w-4xl flex flex-col md:flex-row items-center gap-10 z-10">
        
        {/* Fun Character Image */}
        <img
          src="https://upload.wikimedia.org/wikipedia/en/2/23/Mike_Wazowski.png"
          alt="404 Not Found"
          className="w-64 md:w-80 animate-bounce"
        />

        {/* Text Section */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 drop-shadow-lg">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mt-2">
            OOPS! PAGE NOT FOUND 🚪
          </h2>
          <p className="text-lg text-gray-700 mt-4 max-w-lg">
            Looks like you took a wrong turn... or maybe Mike ate the page!  
            Let’s get you back on track before the monsters find you. 👀
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-gradient-to-r from-yellow-500 to-pink-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition duration-300"
          >
            ⬅ BACK TO HOME
          </Link>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-12 text-gray-700 text-sm text-center z-10">
        <p className="mb-3 font-medium text-lg">Follow us on</p>
        <div className="flex justify-center gap-6 text-2xl">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:scale-125 transition-transform duration-200"
          >
            <FaInstagram />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:scale-125 transition-transform duration-200"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 hover:scale-125 transition-transform duration-200"
          >
            <FaTelegramPlane />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:scale-125 transition-transform duration-200"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
