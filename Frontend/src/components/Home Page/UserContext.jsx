import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("activeSession");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("activeSession");
    setUser(null);
    toast.info("👋 Logged out successfully!");
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
