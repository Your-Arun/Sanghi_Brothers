import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import homeImage from "/petrol.png";
import AboutUs from "./AboutsUs";
import ServicesPage from "./ServicesPage";
import ContactUs from "./ContactUs";
import { FiX } from "react-icons/fi"; // Assuming you can use icons, if not, use text "X"

const Home = () => {
  const [authMode, setAuthMode] = useState(null); // 'login' or 'signup'

  const handleClose = () => {
    setAuthMode(null);
  };

  return (
    <div className="bg-gray-50 font-sans selection:bg-yellow-200">
      
      {/* --- HERO SECTION --- */}
      <div className="relative flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Section: Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-16 lg:py-0 bg-white z-10">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              We are happily saying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
                we are awesome.
              </span>
            </h1>

            <div className="h-1 w-20 bg-yellow-500 mx-auto lg:mx-0 mb-8 rounded-full"></div>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => setAuthMode("login")}
                className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-yellow-400 hover:shadow-yellow-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                LOGIN NOW
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className="group border-2 border-gray-900 px-8 py-4 rounded-xl font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">CREATE ACCOUNT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Image & Overlay Form */}
        <div className="relative w-full lg:w-1/2 h-[500px] lg:h-auto overflow-hidden">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url(${homeImage})`,
            }}
          >
            <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
            {/* Design Element: Polygon Clip only for Desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent lg:w-20 hidden lg:block"></div>
          </div>

          {/* Desktop Form Overlay (Glassmorphism) */}
          {authMode && (
            <div className="hidden lg:flex absolute inset-0 items-center justify-center z-20 bg-black/40 backdrop-blur-sm transition-all duration-500">
              <div className="relative w-[90%] max-w-md bg-white/95 shadow-2xl rounded-2xl p-2 animate-fade-in-up border border-gray-200">
                 {/* Close Button specific for desktop overlay */}
                 <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-30 text-gray-500 hover:text-red-500 transition"
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

      {/* --- MOBILE FULL SCREEN MODAL --- */}
      {authMode && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-slide-up">
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-30 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
            >
                <FiX size={20} />
            </button>
            <div className="p-2">
                {authMode === "login" ? (
                <Login embedMode onClose={handleClose} />
                ) : (
                <Signup embedMode onClose={handleClose} />
                )}
            </div>
          </div>
        </div>
      )}

      {/* --- SECTIONS --- */}
      <div className="relative z-10 space-y-0">
        <AboutUs />
        <ServicesPage />
        <ContactUs />
      </div>

    </div>
  );
};

export default Home;