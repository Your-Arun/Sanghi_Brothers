import React, { useState, useEffect } from "react";

const DesktopOnlyWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );
      const isSmallScreen = window.innerWidth < 1024;

      if (isMobileDevice && isSmallScreen) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkDevice(); // initial run
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm text-center border border-yellow-200">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-3xl">💻</span>
          </div>
          <h2 className="mt-12 text-2xl font-extrabold text-gray-800">
            Desktop Only Feature
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Ye feature sirf{" "}
            <span className="font-semibold text-yellow-600">
              desktop screen
            </span>{" "}
            par available hai. Apne device ko desktop mode me open kare.
          </p>
          <div className="mt-5 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
              alt="Desktop Icon"
              className="w-20 h-20 opacity-90"
            />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DesktopOnlyWrapper;
