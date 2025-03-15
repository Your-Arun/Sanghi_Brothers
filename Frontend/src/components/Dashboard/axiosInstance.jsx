import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization token in headers for every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken"); // Get token from sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
);

export default axiosInstance;
