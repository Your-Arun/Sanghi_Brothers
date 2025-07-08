import React, { useState } from "react";
import homeImage from "/petrol.png";
import AboutUs from "./AboutsUs";
import ServicesPage from "./ServicesPage";
import ContactUs from "./ContactUs";
import Footer from "./Footer";
import Login from "./Login";
import Signup from "./Signup";

const Home = () => {
  const [activeForm, setActiveForm] = useState(null); // 'login' | 'signup' | null

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen relative">

        {/* Left Section */}
        <div className="w-full md:w-1/2 px-6 md:px-12 lg:px-20 py-12 z-10 bg-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-snug">
            We are happily saying <br /> we are awesome
          </h1>

          <p className="text-gray-600 mb-8 text-base sm:text-lg font-semibold">
            THIS IS NOT THE YEAR YOU GET EVERYTHING YOU WANT, THIS IS THE YEAR TO APPRECIATE EVERYTHING YOU HAVE.
          </p>

          <div className="flex flex-col sm:flex-row mt-10 items-center gap-4">
            <button
              onClick={() => setActiveForm("login")}
              className="bg-yellow-500 text-black px-6 py-3 rounded shadow hover:bg-yellow-400 transition duration-300 font-semibold"
            >
              LOGIN
            </button>
            <button
              onClick={() => setActiveForm("signup")}
              className="border-2 border-black px-6 py-3 rounded shadow hover:bg-black hover:text-white transition duration-300 font-semibold"
            >
              SIGNUP
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative w-full md:w-1/2 h-[500px] md:h-auto overflow-hidden z-0">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${homeImage})`,
              clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)"
            }}
          />

          {/* Floating Form on Image */}
          {activeForm && (
            <div className="absolute top-8 right-8 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-[90%] max-w-sm z-10">
              <button
                onClick={() => setActiveForm(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-sm"
              >
                ✕
              </button>
              {activeForm === "login" ? (
                <Login embedMode={true} />
              ) : (
                <Signup embedMode={true} />
              )}
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
