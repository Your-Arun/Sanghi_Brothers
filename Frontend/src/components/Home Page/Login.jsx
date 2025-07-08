import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import UserContext from "./UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";

const Login = ({ embedMode, onClose }) => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Session key setup
  const sessionKey =
    sessionStorage.getItem("activeSession") ||
    `userSession_${Math.random().toString(36).substring(2, 11)}`;
  sessionStorage.setItem("activeSession", sessionKey);

  useEffect(() => {
    const fetchUser = async () => {
      const sessionData = sessionStorage.getItem(sessionKey);
      if (!sessionData) return;

      try {
        const { data } = await axiosInstance.get("/profile");
        setUser(data.user);
      } catch {
        sessionStorage.removeItem(sessionKey);
      }
    };
    fetchUser();
  }, [setUser, sessionKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/login", { email, password });

      sessionStorage.setItem(sessionKey, JSON.stringify(data.user));
      sessionStorage.setItem("authToken", data.token);
      setUser(data.user);
      toast.success("Login Successful");

      if (data.user.department === "admin") {
        navigate("/admin-panel");
      } else {
        navigate(
          data.user.department === "staff" ? "/staff-dashboard" : "/dashboard"
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid credentials, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Left Form Side */}
        <div className="w-full md:w-1/2 flex justify-center items-center px-6">
          <form
            className="bg-white bg-opacity-60 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-sm md:max-w-md"
            onSubmit={handleSubmit}
          >
            <h2 className="text-5xl font-bold mb-6 text-center text-blue-600">
              Login
            </h2>

            <input
              type="email"
              placeholder="Email (case sensitive)"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Field */}
            <div className="passwordinput">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="passwordinput-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="buttonn"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="icon-eye" size={20} />
                ) : (
                  <Eye className="icon-eye" size={20} />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>



            <p className="mt-2 text-center text-gray-600">
              Forgot your password?{" "}
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                Reset it here
              </Link>
            </p>

            <p className="mt-3 text-sm text-center">
              <button onClick={onClose} className="text-blue-500 underline">Close</button>
            </p>

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
