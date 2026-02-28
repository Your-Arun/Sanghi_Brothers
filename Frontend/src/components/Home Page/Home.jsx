import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import homeImage from "/petrol.png"; 
import AboutUs from "./AboutsUs";
import ServicesPage from "./ServicesPage";
import ContactUs from "./ContactUs";
import { FiX } from "react-icons/fi";

const Home = () => {
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup'
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setAuthMode(null);
      setIsAnimating(false);
    }, 300); // 300ms for smooth slide-down
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (authMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [authMode]);

  return (
    <div className="bg-gray-50 font-sans selection:bg-orange-200">
      {/* ---------- HERO SECTION ---------- */}
      <div className="relative flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-20 lg:py-0 bg-white z-10">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              We are happily saying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
                we are awesome.
              </span>
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto lg:mx-0">
              Experience the best service management platform. Join us today and streamline your workflow effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => setAuthMode("login")} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-gray-800 transition-all w-full sm:w-auto">
                LOGIN NOW
              </button>
              <button onClick={() => setAuthMode("signup")} className="bg-white border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:border-gray-900 hover:bg-gray-50 transition-all w-full sm:w-auto">
                CREATE ACCOUNT
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2 h-[400px] lg:h-auto overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: `url(${homeImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent lg:bg-black/20" />
          </div>
        </div>
      </div>

      {/* ---------- NATIVE APP-STYLE BOTTOM SHEET (MOBILE) / MODAL (DESKTOP) ---------- */}
      {authMode && (
        <div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center">
          
          {/* Dark Blur Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
            onClick={handleClose}
          />

          {/* Form Container (100% width on mobile, rounded box on desktop) */}
          <div 
            className={`relative w-full sm:w-[480px] bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
              isAnimating ? "translate-y-full opacity-0 sm:scale-95" : "translate-y-0 opacity-100 sm:scale-100"
            }`}
            style={{ maxHeight: '92vh' }}
          >
            {/* iOS Style Drag Handle (Only Mobile) */}
            <div className="w-full flex justify-center pt-4 pb-2 sm:hidden" onClick={handleClose}>
              <div className="w-14 h-1.5 bg-gray-300 rounded-full cursor-pointer" />
            </div>

            {/* Close Button (Only Desktop) */}
            <button onClick={handleClose} className="hidden sm:flex absolute top-5 right-5 p-2 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors z-10">
              <FiX size={22} />
            </button>

            {/* Scrollable Form Content */}
            <div className="overflow-y-auto px-6 pb-8 pt-2 sm:pt-8 custom-scrollbar">
              {authMode === "login" ? (
                <Login switchToSignup={() => setAuthMode("signup")} />
              ) : (
                <Signup switchToLogin={() => setAuthMode("login")} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- OTHER SECTIONS ---------- */}
      <div className="relative z-10 bg-white">
        <AboutUs />
        <ServicesPage />
        <ContactUs />
      </div>
    </div>
  );
};

export default Home;