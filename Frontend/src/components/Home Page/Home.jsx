import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-green-200 px-4">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transition-transform transform">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
          Welcome Home
        </h1>
        <p className="text-gray-700 mb-6 text-base md:text-lg">
          Switch between <span className="font-semibold">Login</span> or{" "}
          <span className="font-semibold">Signup</span> below.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105 text-sm md:text-base"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105 text-sm md:text-base"
          >
            Signup
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
