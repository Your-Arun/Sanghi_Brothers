import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionTimeout = ({ timeout = 10 * 60 * 1000 }) => { // Default: 10 min (600,000 ms)
  const navigate = useNavigate();

  useEffect(() => {
    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        console.log("Session expired due to inactivity");
        localStorage.removeItem("authToken"); // Clear token
        navigate("/");
      }, timeout);
    };

    // Start timeout when component mounts
    resetTimer();

    // Reset timer on user interaction
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [navigate, timeout]);

  return null; // No UI needed
};

export default SessionTimeout;
