import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          <h2 className="text-3xl font-bold mb-4">⛽ Sanghi Bros.</h2>
          <p className="mb-4 text-sm">
            Trusted dealer and service provider. We offer best-in-class vehicle servicing and customer support.
          </p>
          <div className="flex space-x-3 mt-4">
            <a href="https://www.facebook.com/" className="text-yellow-400 hover:text-yellow-300"><FaFacebookF /></a>
            <a href="https://www.twitter.com/" className="text-yellow-400 hover:text-yellow-300"><FaTwitter /></a>
            <a href="https://www.google.com/" className="text-yellow-400 hover:text-yellow-300"><FaGoogle /></a>
            <a href="https://www.linkedin.com/" className="text-yellow-400 hover:text-yellow-300"><FaLinkedin /></a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-sm">
            <li><span className="text-yellow-400">📍</span> Sanghi Brothers,Olympic circle near station road, Jodhpur(Rajasthan)</li>
            <li><span className="text-yellow-400">📞</span><a href="tel" to="" className="hover:text-yellow-400"> 098209111507</a></li>
            <li><span className="text-yellow-400">✉️</span><a href="mail" className="hover:text-yellow-400"> sanghibrothers@gmail.com </a></li>
            <li><span className="text-yellow-400">🔗</span><a href="#" className="hover:text-yellow-400"> www.sanghibros.com</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#contacts" className="hover:text-yellow-400">Helpdesk</a></li>
            <li><a href="/about" className="hover:text-yellow-400">About Us</a></li>
            <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
            <li><a href="/services" className="hover:text-yellow-400">Services</a></li>
          </ul>
        </div>

        {/* Partners */}
        {/* <div>
          <h3 className="text-lg font-bold mb-4">Others</h3>
          <ul className="space-y-2 text-sm">
            <li></li>
          </ul>
        </div> */}
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sanghi Bros. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
