import React from "react";
import { Link } from "react-router-dom";
import homeImage from "/petrol.png";
import AboutUs from "./AboutsUs";
import ServicesPage from "./ServicesPage";
import ContactUs from "./ContactUs";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between min-h-screen">
        
        {/* Left Section */}
        <div className="w-full md:w-1/2 px-6 sm:px-8 md:px-12 lg:px-20 py-12 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-snug">
            We are happily saying <br /> we are awesome
          </h1>
          <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-md mx-auto md:mx-0 font-semibold">
            THIS IS NOT THE YEAR YOU GET EVERYTHING YOU WANT THIS IS THE YEAR TO APPRECIATE EVERYTHING YOU HAVE
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              to="/login"
              className="bg-yellow-500 text-black px-6 py-3 rounded shadow hover:bg-yellow-400 transition duration-300 font-semibold w-full sm:w-auto text-center"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="border-2 border-black px-6 py-3 rounded shadow hover:bg-black hover:text-white transition duration-300 font-semibold w-full sm:w-auto text-center"
            >
              SIGNUP
            </Link>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full md:w-1/2 h-72 sm:h-96 md:h-[500px] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(${homeImage})`,
              clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>
      </div>

      {/* Sub Sections */}
      <AboutUs />
      <ServicesPage />
      <ContactUs />
      <Footer />
    </>
  );
};

export default Home;
