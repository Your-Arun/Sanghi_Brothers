import { createContext, useState, useEffect } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem("currentUser")) || null;
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await axiosInstance.get("/profile");
        setUser(data.user);
        sessionStorage.setItem("currentUser", JSON.stringify(data.user)); // ✅ Store per tab session
      } catch (err) {
        console.error("❌ Session Expired:", err.response?.data);
        handleLogout();
      }
    };

    if (user) checkSession();
  }, []);

  const handleLogout = async () => {
    await axiosInstance.post("/logout");
    sessionStorage.removeItem("authToken"); // ✅ Use sessionStorage instead of localStorage
    sessionStorage.removeItem("currentUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
