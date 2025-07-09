import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import homeImage from "/petrol.png";
import AboutUs from "./AboutsUs";
import ServicesPage from "./ServicesPage";
import ContactUs from "./ContactUs";
import Footer from "./Footer";

const Home = () => {
  const [authMode, setAuthMode] = useState(null); // 'login' or 'signup'

  const handleClose = () => setAuthMode(null);

  return (
    <>
      <div className="relative flex flex-col md:flex-row items-center justify-between min-h-screen overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-snug">
            We are happily saying <br /> we are awesome
          </h1>

          <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-md font-semibold">
            THIS IS NOT THE YEAR YOU GET EVERYTHING YOU WANT, THIS IS THE YEAR TO APPRECIATE EVERYTHING YOU HAVE.
          </p>

          <div className="flex flex-col sm:flex-row mt-10 gap-4">
            <button
              onClick={() => setAuthMode("login")}
              className="bg-yellow-500 text-black px-6 py-3 rounded shadow hover:bg-yellow-400 transition font-semibold"
            >
              LOGIN
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className="border-2 border-black px-6 py-3 rounded shadow hover:bg-black hover:text-white transition font-semibold"
            >
              SIGNUP
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative w-full md:w-1/2 h-[480px]">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${homeImage})`,
              clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
              filter: "brightness(0.9)",
            }}
          ></div>

          {/* Overlaid form for medium and up screens */}
          {authMode && (
            <div className="hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[75%] lg:w-[60%] xl:w-[50%] z-20">
              {authMode === "login" ? (
                <Login embedMode onClose={handleClose} />
              ) : (
                <Signup embedMode onClose={handleClose} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup for mobile (below md) */}
      {authMode && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-4 rounded-lg w-full max-w-sm shadow-xl">
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
      <Footer />
    </>
  );
};

export default Home;
