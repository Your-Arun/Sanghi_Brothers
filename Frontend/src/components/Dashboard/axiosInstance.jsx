import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sanghi-bros.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add Authorization token in headers for every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

// ✅ Handle session expiration (Auto logout on 401 error)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("authToken"); // Clear token
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
