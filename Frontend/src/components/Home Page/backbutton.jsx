import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../Home Page/UserContext"; // ✅ Import User Context

const BackButton = ({ previousImage }) => {
  const { user } = useContext(UserContext); // ✅ Get logged-in user
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const showAnyway = pageHeight <= window.innerHeight + 20; // fallback for short pages
  
      setShowButton(scrollPosition >= pageHeight - 10 || showAnyway);
    };
  
    handleScroll(); // run once immediately
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  if (!showButton) return null; // Hide button when not at bottom

  // ✅ Role-based redirection
  const backPath = user?.department === "staff" ? "/staff-dashboard" : "/dashboard";

  return (
    <div className="fixed bottom-6 left-6 p-4 rounded-full">
      <Link to={backPath} className="hidden md:block">
        <img src={previousImage} alt="Back" width={50} className="rounded-full" />
      </Link>
    </div>
  );
};

export default BackButton;