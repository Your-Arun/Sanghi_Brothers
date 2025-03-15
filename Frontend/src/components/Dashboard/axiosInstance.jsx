import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500", // Adjust based on your backend
  withCredentials: true,
});

// ✅ Use sessionStorage instead of localStorage to store per-tab tokens
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
