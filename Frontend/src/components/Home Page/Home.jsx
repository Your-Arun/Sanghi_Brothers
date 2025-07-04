import React from "react";
import { Link } from "react-router-dom";
import homeImage from "/petrol.png"; // Make sure this image exists in public or src
import AboutUs from "./AboutsUs";
import ServicesPage from "./ServicesPage";
import ContactUs from "./ContactUs";

const Home = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between min-h-screen">
        {/* Left Section */}
        <div className="w-full md:w-1/2 px-6 md:px-12 lg:px-20 py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
            We are happily saying <br /> we are awesome
          </h1>
          <p className="text-gray-600 mb-8 text-base md:text-lg max-w-md font-bold">
            THIS IS NOT THE YEAR YOU GET EVERYTHING YOU WANT THIS IS THE YEAR TO APPRECIATE EVERYTHING YOU HAVE
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/login"
              className="bg-yellow-500 text-black px-6 py-3 rounded shadow hover:bg-yellow-400 transition duration-300 font-semibold"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="border-2 border-black px-6 py-3 rounded shadow hover:bg-black hover:text-white transition duration-300 font-semibold"
            >
              SIGNUP
            </Link>
          </div>
        </div>

        {/* Right Section - Image with Diagonal Cut */}
        <div className="hidden md:block w-full md:w-1/2 h-[500px] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(${homeImage})`,
              clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>
      </div>
      <AboutUs />
      <ServicesPage />
      <ContactUs />
    </>
  );
};

export default Home;
