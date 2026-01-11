import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import homeImage from "/petrol.png";
import AboutUs from "./AboutsUs";
import ServicesPage from "./ServicesPage";
import ContactUs from "./ContactUs";
import { FiX } from "react-icons/fi";

const Home = () => {
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup'

  const handleClose = () => setAuthMode(null);

  return (
    <div className="bg-gray-50 font-sans selection:bg-yellow-200">

      {/* ---------- HERO SECTION ---------- */}
      <div
        className={`relative flex flex-col lg:flex-row min-h-screen
        ${authMode ? "hidden lg:flex" : "flex"}`}
      >

        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-16 lg:py-0 bg-white z-10">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              We are happily saying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
                we are awesome.
              </span>
            </h1>

            <div className="h-1 w-20 bg-yellow-500 mx-auto lg:mx-0 mb-8 rounded-full" />

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => setAuthMode("login")}
                className="bg-yellow-500 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-yellow-400 transition"
              >
                LOGIN NOW
              </button>

              <button
                onClick={() => setAuthMode("signup")}
                className="border-2 border-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full lg:w-1/2 h-[500px] lg:h-auto overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${homeImage})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* DESKTOP OVERLAY FORM */}
          {authMode && (
            <div className="hidden lg:flex absolute inset-0 items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
              <div className="relative w-[90%] max-w-md bg-white rounded-2xl p-2 shadow-2xl">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
                >
                  <FiX size={24} />
                </button>

                {authMode === "login" ? (
                  <Login embedMode onClose={handleClose} />
                ) : (
                  <Signup embedMode onClose={handleClose} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- MOBILE FULL SCREEN AUTH ---------- */}
      {authMode && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-center bg-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600"
          >
            <FiX size={20} />
          </button>

          <div className="w-full max-w-md px-2">
            {authMode === "login" ? (
              <Login embedMode onClose={handleClose} />
            ) : (
              <Signup embedMode onClose={handleClose} />
            )}
          </div>
        </div>
      )}

      {/* ---------- OTHER SECTIONS ---------- */}
      <div
        className={`relative z-10
        ${authMode ? "hidden lg:block" : "block"}`}
      >
        <AboutUs />
        <ServicesPage />
        <ContactUs />
      </div>

    </div>
  );
};

export default Home;