import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import homeImage from "/petrol.png";
import AboutUs from "./AboutsUs";
import ServicesPage from "./ServicesPage";
import ContactUs from "./ContactUs";

const Home = () => {
  const [authMode, setAuthMode] = useState(null); // 'login' or 'signup'

  const handleClose = () => {
    setAuthMode(null);
  };

  return (
    <>
      {/* Main Layout */}
      <div className="relative flex flex-col md:flex-row items-center justify-between min-h-[auto] md:min-h-screen overflow-hidden">

        {/* Left Section */}
        <div className="w-full md:w-1/2 px-6 sm:px-10 md:px-16 py-14 md:py-25 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-6 leading-snug">
            We are happily saying <br /> we are awesome
          </h1>

          <p className="text-gray-600 mb-10 text-base sm:text-lg max-w-md mx-auto md:mx-0 font-medium leading-relaxed">
            THIS IS NOT THE YEAR YOU GET EVERYTHING YOU WANT, THIS IS THE YEAR TO APPRECIATE EVERYTHING YOU HAVE.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => setAuthMode("login")}
              className="bg-yellow-500 text-black w-full sm:w-auto px-6 py-3 rounded-lg shadow-md hover:bg-yellow-400 transition font-semibold"
            >
              LOGIN
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className="border-2 border-black w-full sm:w-auto px-6 py-3 rounded-lg shadow-md hover:bg-black hover:text-white transition font-semibold"
            >
              SIGNUP
            </button>
          </div>
        </div>

        {/* Right Section (image only for desktop) */}
        <div className="relative w-full md:w-1/2 md:h-[500px] hidden md:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${homeImage})`,
              clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
              filter: "brightness(0.9)",
            }}
          ></div>

          {authMode && (
            <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-[85%] md:w-[70%] lg:w-[55%] xl:w-[45%] z-20">
              {authMode === "login" ? (
                <Login embedMode onClose={handleClose} />
              ) : (
                <Signup embedMode onClose={handleClose} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Full-Screen Modal */}
      {authMode && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center px-6 md:hidden">
          <div className="w-full max-w-sm p-4">
            {authMode === "login" ? (
              <Login embedMode onClose={handleClose} />
            ) : (
              <Signup embedMode onClose={handleClose} />
            )}
          </div>
        </div>
      )}

      {/* Other Sections */}
      <AboutUs />
      <ServicesPage />
      <ContactUs />
    </>
  );
};

export default Home;
