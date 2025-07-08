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
      <div className="flex flex-col md:flex-row items-center justify-between min-h-screen">
        {/* Left Section */}
        <div className="w-full md:w-1/2 px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-snug">
            We are happily saying <br /> we are awesome
          </h1>
          <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-md mx-auto md:mx-0 font-semibold">
            THIS IS NOT THE YEAR YOU GET EVERYTHING YOU WANT, THIS IS THE YEAR TO APPRECIATE EVERYTHING YOU HAVE.
          </p>

          <div className="flex flex-col sm:flex-row mt-10 items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => setActiveForm("login")}
              className="bg-yellow-500 text-black px-6 py-3 rounded shadow hover:bg-yellow-400 transition duration-300 font-semibold text-center"
            >
              LOGIN
            </button>
            <button
              onClick={() => setActiveForm("signup")}
              className="border-2 border-black px-6 py-3 rounded shadow hover:bg-black hover:text-white transition duration-300 font-semibold text-center"
            >
              SIGNUP
            </button>
          </div>
        </div>

        {/* Right Section Image */}
        <div className="hidden md:block w-full md:w-1/2 h-72 sm:h-96 md:h-[500px] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(${homeImage})`,
              clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>
      </div>

      {/* Conditionally Render Login or Signup */}
      {activeForm === "login" && <Login onClose={() => setActiveForm(null)} />}
      {activeForm === "signup" && <Signup onClose={() => setActiveForm(null)} />}

      {/* Other Sections */}
      <AboutUs />
      <ServicesPage />
      <ContactUs />
      <Footer />
    </>
  );
};

export default Home;
