import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const key = sessionStorage.getItem("activeSession");
    return key ? JSON.parse(sessionStorage.getItem(key)) : null;
  });
  

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("activeSession");
    setUser(null);
    toast.info("👋 Logged out successfully!"); // ✅ Toast should work here
      window.location.href = "/";
  };


  useEffect(() => {
    const sessionKey = sessionStorage.getItem("activeSession");
    if (sessionKey) {
      const storedUser = JSON.parse(sessionStorage.getItem(sessionKey));
      setUser(storedUser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
