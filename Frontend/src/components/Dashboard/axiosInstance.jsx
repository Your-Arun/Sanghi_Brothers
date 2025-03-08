import axios from "axios";

// 🔹 Backend ka base URL define karo
const API_BASE_URL = "http://localhost:5500";

// 🔹 Axios instance create karo
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Cookies allow karega
});

// 🔹 Request interceptor: Har request pe `Authorization` header set karega
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 🔹 Response interceptor: Error handling ke liye
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Axios Error:", error.response?.data || error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
