import axiosInstance from '../Dashboard/axiosInstance';
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateInput = (data) => {
    if (!data.name || !data.email || !data.message) {
      setError("All fields are required");
      return false;
    }

    if (!data.email.includes("@")) {
      setError("Invalid email address");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput(formData)) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/contactus", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Message sent successfully 🎉", { autoClose: 2000 });
        setFormData({ name: "", email: "", message: "" });
        setError(null);
      } else {
        setError("Failed to send message");
        toast.error("Failed to send message ❌");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again later.");
      toast.error("Something went wrong, try again ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen px-4 sm:px-6 py-8 sm:py-12 gap-8">
      {/* Contact Form Section */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-xl relative">
        {/* Avatar */}
        <div className="flex justify-center -mt-14 mb-4">
          <img
            src="/user.png" // yaha apni image lagao
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-600 mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-600 text-center mb-5 text-sm sm:text-base">
          We'd love to hear from you. Fill out the form and we’ll be in touch soon.
        </p>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-lg text-lg font-medium transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Google Maps Section */}
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-xl shadow-xl h-[300px] sm:h-[350px] lg:h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.409611980526!2d73.01631247476406!3d26.2808180869613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c4988d1fb21%3A0x8d0289bfdadecc10!2sSanghi%20Brothers%20Petrol%20Pump!5e0!3m2!1sen!2sin!4v1735299586647!5m2!1sen!2sin"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            title="Google Maps"
            className="w-full h-full rounded-xl border border-gray-300"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
