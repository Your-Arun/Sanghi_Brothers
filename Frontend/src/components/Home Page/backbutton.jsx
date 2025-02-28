import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BackButton = ({ previousImage }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // Check if user is at the bottom of the page
      setShowButton(scrollPosition >= pageHeight - 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showButton) return null; // Hide button when not at bottom

  return (
    <div className="fixed bottom-6 left-6 p-4 rounded-full">
      <Link to="/dashboard" className="hidden md:block">
        <img src={previousImage} alt="Back" width={50} className="rounded-full" />
      </Link>
    </div>
  );
};

export default BackButton;
