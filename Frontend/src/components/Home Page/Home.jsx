import React from "react";

const Home = () => {
  return (
    <>
     
      <div className="flex flex-col justify-center items-center h-[calc(100vh-12rem)] bg-gradient-to-r from-blue-200 to-green-200">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg w-80">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome Home</h1>
          <p className="text-gray-700 mb-4">
            Switch between <span className="font-semibold">Login</span> or <span className="font-semibold">Signup</span> below.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105"
            >
              Signup
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;