import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500", // ✅ Backend ka URL
  withCredentials: true, // ✅ Cookies allow karo
});

export default axiosInstance;
