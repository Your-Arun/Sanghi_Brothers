import axiosInstance from "../Dashboard/axiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Send, MapPin, Mail, User, Loader2 } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState(null);
  const[loading, setLoading] = useState(false);

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
    setFormData({ ...formData, [name]: value });
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
        toast.success("Message sent successfully", { autoClose: 2000 });
        setFormData({ name: "", email: "", message: "" });
        setError(null);
      } else {
        setError("Failed to send message");
        toast.error("Failed to send message");
      }
    } catch (error) {
      setError("Failed to send message. Please try again later.");
      toast.error("Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-yellow-200">
      <div className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-yellow-500 font-bold tracking-widest uppercase text-xs sm:text-sm">24/7 Support</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4">Get in Touch</h1>
          <p className="text-gray-400 text-base sm:text-lg">Have questions about fuel rates, bulk orders, or services? We are here to help.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 pb-14 sm:pb-20">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="w-full lg:w-1/2 bg-white p-5 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
            <p className="text-gray-500 mb-6 sm:mb-8 text-sm">Fill out the form below and our team will get back to you shortly.</p>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              
              {/* NAME INPUT */}
              <div className="relative group">
                {/* 100% height container (inset-y-0) flex items-center to perfectly center icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* EMAIL INPUT */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all font-medium text-gray-900 placeholder-gray-400 min-h-[130px] sm:min-h-[150px] resize-none"
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                  loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-yellow-500/30"
                }`}
              >
                {loading ? <>Sending... <Loader2 className="animate-spin h-5 w-5" /></> : <>Send Message <Send className="h-5 w-5" /></>}
              </button>
            </form>
          </div>

          {/* MAP */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5 sm:gap-6 z-10">
            <div className="bg-gray-900 p-2 rounded-2xl shadow-xl h-[280px] sm:h-[360px] lg:h-full lg:min-h-[400px] relative group">
              <div className="absolute inset-0 bg-yellow-500 rounded-2xl transform translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform -z-10" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.409611980526!2d73.01631247476406!3d26.2808180869613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c4988d1fb21%3A0x8d0289bfdadecc10!2sSanghi%20Brothers%20Petrol%20Pump!5e0!3m2!1sen!2sin!4v1735299586647!5m2!1sen!2sin"
                width="100%" height="100%" allowFullScreen="" loading="lazy" title="Sanghi Brothers Location"
                className="w-full h-full rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;