import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Sanghi Bros.</h2>
          <p className="mb-4 text-sm leading-relaxed">
            Trusted dealer and service provider. We offer best-in-class vehicle servicing and
            customer support.
          </p>
          <div className="flex space-x-3 mt-4">
            <a href="https://www.facebook.com/" className="text-yellow-400 hover:text-yellow-300" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://www.twitter.com/" className="text-yellow-400 hover:text-yellow-300" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://www.google.com/" className="text-yellow-400 hover:text-yellow-300" aria-label="Google">
              <FaGoogle />
            </a>
            <a href="https://www.linkedin.com/" className="text-yellow-400 hover:text-yellow-300" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-sm leading-relaxed break-words">
            <li>Sanghi Brothers, Olympic Circle, Near Station Road, Jodhpur (Rajasthan)</li>
            <li>
              <a href="tel:+9198209111507" className="hover:text-yellow-400">
                +91 98209 111507
              </a>
            </li>
            <li>
              <a href="mailto:sanghi.jodhpur@gmail.com" className="hover:text-yellow-400">
                sanghi.jodhpur@gmail.com
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-yellow-400">www.sanghibros.com</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/contacts" className="hover:text-yellow-400">Helpdesk</a></li>
            <li><a href="/about" className="hover:text-yellow-400">About Us</a></li>
            <li><a href="/" className="hover:text-yellow-400">Privacy Policy</a></li>
            <li><a href="/services" className="hover:text-yellow-400">Services</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 sm:mt-10 pt-6 text-center text-xs sm:text-sm text-gray-500">
        Copyright {new Date().getFullYear()} Sanghi Bros. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
