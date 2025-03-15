import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500",
  withCredentials: true, // ✅ Ensures session token is sent
});

export default axiosInstance;
