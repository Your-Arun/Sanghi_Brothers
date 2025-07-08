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
        <div className="w-full md:w-1/2 h-[400px] md:h-[480px] relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${homeImage})`,
              clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
              filter: "brightness(0.95)",
            }}
          ></div>

          {/* Login/Signup Overlay */}
          {authMode && (
            <div className="absolute inset-0 bg-black flex items-start justify-center md:px-10">
              <div className="w-full max-w-md">
                {authMode === "login" ? (
                  <Login embedMode onClose={() => setAuthMode(null)} />
                ) : (
                  <Signup embedMode onClose={() => setAuthMode(null)} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Sections */}
      <AboutUs />
      <ServicesPage />
      <ContactUs />
      <Footer />
    </>
  );
};

export default Home;
