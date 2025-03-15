import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500", // Change according to your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization token automatically to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
