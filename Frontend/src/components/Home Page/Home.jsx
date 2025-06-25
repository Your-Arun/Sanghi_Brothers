import React from "react";
import { Link } from "react-router-dom";
import homeLogo from "/bg.jpg";

const Home = () => {
  return (
    <>

      <div
        className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center px-4"
        style={{ backgroundImage: `url(${homeLogo})` }}
      >
        <div className="bg-white bg-opacity-60 text-center p-6 md:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transition-transform transform">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            Welcome Home
          </h1>
          <p className="text-gray-700 mb-6 text-base md:text-lg">
            Switch between <span className="font-semibold">Login</span> or{" "}
            <span className="font-semibold">Signup</span> below.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105 active:scale-95 text-sm md:text-base w-full sm:w-auto text-center"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105 active:scale-95 text-sm md:text-base w-full sm:w-auto text-center"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;