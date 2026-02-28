import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import homeImage from "/petrol.png";
import AboutUs from "./AboutsUs";
import ServicesPage from "./ServicesPage";
import ContactUs from "./ContactUs";
import { FiX } from "react-icons/fi";

const Home = () => {
  const [authMode, setAuthMode] = useState(null);

  const handleClose = () => setAuthMode(null);

  return (
    <div className="bg-gray-50 font-sans selection:bg-yellow-200 overflow-x-hidden">
      <div
        className={`relative flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] ${
          authMode ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-14 lg:px-20 py-10 sm:py-14 lg:py-0 bg-white z-10">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 sm:mb-6 leading-tight">
              We are happily saying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
                we are awesome.
              </span>
            </h1>

            <div className="h-1 w-16 sm:w-20 bg-yellow-500 mx-auto lg:mx-0 mb-7 sm:mb-8 rounded-full" />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => setAuthMode("login")}
                className="w-full sm:w-auto bg-yellow-500 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold shadow-lg hover:bg-yellow-400 transition"
              >
                LOGIN NOW
              </button>

              <button
                onClick={() => setAuthMode("signup")}
                className="w-full sm:w-auto border-2 border-gray-900 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2 h-[320px] sm:h-[420px] lg:h-auto overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${homeImage})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {authMode && (
            <div className="hidden lg:flex absolute inset-0 items-center justify-center z-20 bg-black/40 backdrop-blur-sm p-6">
              <div className="relative w-full max-w-md bg-white rounded-2xl p-3 shadow-2xl max-h-[92vh] overflow-y-auto">
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
                  aria-label="Close"
                >
                  <FiX size={22} />
                </button>

                {authMode === "login" ? (
                  <Login embedMode onClose={handleClose} />
                ) : (
                  <Signup
                    embedMode
                    onClose={handleClose}
                    switchToLogin={() => setAuthMode("login")}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {authMode && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-start justify-center bg-white/95 backdrop-blur-sm px-3 pt-16 pb-4 overflow-y-auto">
          <button
            onClick={handleClose}
            className="fixed top-3 right-3 p-2 bg-gray-100 rounded-full text-gray-600"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>

          <div className="w-full max-w-md">
            {authMode === "login" ? (
              <Login embedMode onClose={handleClose} />
            ) : (
              <Signup
                embedMode
                onClose={handleClose}
                switchToLogin={() => setAuthMode("login")}
              />
            )}
          </div>
        </div>
      )}

      <div className={`relative z-10 ${authMode ? "hidden lg:block" : "block"}`}>
        <AboutUs />
        <ServicesPage />
        <ContactUs />
      </div>
    </div>
  );
};

export default Home;
