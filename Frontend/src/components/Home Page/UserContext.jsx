import { createContext, useState, useEffect } from "react";
import axiosInstance from "../Dashboard/axiosInstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/profile", { withCredentials: true });
        console.log("✅ User Data Fetched in Context:", data.user);
        setUser(data.user);
      } catch (err) {
        console.error("❌ Error fetching user in Context:", err);
      }
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default UserContext;
