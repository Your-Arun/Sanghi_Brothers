// import React, { useState } from "react";
// import Login from "./Login";
// import Signup from "./Signup";
// import homeImage from "/petrol.png";
// import AboutUs from "./AboutsUs";
// import ServicesPage from "./ServicesPage";
// import ContactUs from "./ContactUs";
// import Footer from "./Footer";

// const Home = () => {
//   const [authMode, setAuthMode] = useState(null); // 'login' or 'signup'

//   const handleClose = () => {
//     setAuthMode(null);
//   };

//   return (
//     <>
//       {/* Main Layout */}
//       <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between min-h-[auto] md:min-h-screen overflow-hidden">

//         {/* Left Section */}
//         <div className="w-full md:w-1/2 px-4 sm:px-6 md:px-12 lg:px-20 py-6 md:py-12">
//           <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-4 sm:mb-6 leading-snug">
//             We are happily saying <br /> we are awesome
//           </h1>

//           <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-lg max-w-md font-semibold">
//             THIS IS NOT THE YEAR YOU GET EVERYTHING YOU WANT, THIS IS THE YEAR TO APPRECIATE EVERYTHING YOU HAVE.
//           </p>

//           <div className="flex flex-col sm:flex-row mt-6 sm:mt-8 gap-3 sm:gap-4">
//             <button
//               onClick={() => setAuthMode("login")}
//               className="bg-yellow-500 text-black px-5 py-2.5 sm:px-6 sm:py-3 rounded shadow hover:bg-yellow-400 transition font-semibold"
//             >
//               LOGIN
//             </button>
//             <button
//               onClick={() => setAuthMode("signup")}
//               className="border-2 border-black px-5 py-2.5 sm:px-6 sm:py-3 rounded shadow hover:bg-black hover:text-white transition font-semibold"
//             >
//               SIGNUP
//             </button>
//           </div>
//         </div>

//         {/* Right Section (image on large screens only) */}
//         <div className="relative w-full md:w-1/2 md:h-[480px] hidden md:block">
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{
//               backgroundImage: `url(${homeImage})`,
//               clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
//               filter: "brightness(0.9)",
//             }}
//           ></div>

//           {authMode && (
//             <div className="absolute left-1/2 top-4 transform -translate-x-1/2 w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] z-20">
//               {authMode === "login" ? (
//                 <Login embedMode onClose={handleClose} />
//               ) : (
//                 <Signup embedMode onClose={handleClose} />
//               )}
//             </div>
//           )}
//         </div>


//       </div>

//       {/* Mobile Full-Screen Modal */}
//       {authMode && (
//         <div className="fixed inset-0 bg-white z-50 flex items-center justify-center px-4 md:hidden">
//           <div className="w-full max-w-sm p-4 pt-8">
//             {authMode === "login" ? (
//               <Login embedMode onClose={handleClose} />
//             ) : (
//               <Signup embedMode onClose={handleClose} />
//             )}
//           </div>
//         </div>
//       )}

//       {/* Other Sections */}
//       <AboutUs />
//       <ServicesPage />
//       <ContactUs />
//       <Footer />
//     </>
//   );
// };

// export default Home;





import React from 'react'
import Home from './Homepage'
import AboutUs from './AboutsUs'
import ContactUs from './ContactUs'
import Services from './ServicesPage'


const Home = () => {
  return (
    <>
      <Home/>
      <AboutUs/>
      <ContactUs/>
      <Services/>
    </>
  )
}

export default Home
