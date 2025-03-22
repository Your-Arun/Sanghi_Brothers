import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add Authorization token in headers for every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken"); // Get token from sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
);

// ✅ Handle session expiration (Auto logout on 401 error)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("🚨 Session expired! Logging out...");
      sessionStorage.removeItem("authToken"); // Clear token
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
