import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = ["home", "about", "services", "contacts"];

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex-shrink-0 cursor-pointer min-w-0">
            <NavLink to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
             
              <span className="font-extrabold text-base sm:text-xl md:text-2xl tracking-wide sm:tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-serif truncate">
                Sanghi Brothers
              </span>
            </NavLink>
          </div>

          <div className="hidden md:block">
            <ul className="flex space-x-6 items-center">
              {menuItems.map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/${item === "home" ? "" : item}`}
                    className={({ isActive }) =>
                      `text-sm font-bold uppercase tracking-widest px-3 py-2 rounded-md transition-all duration-300 ${
                        isActive
                          ? "text-yellow-400 bg-gray-800 shadow-inner"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`
                    }
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500 p-2 rounded-md"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 absolute w-full left-0 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="px-3 pt-2 pb-5 space-y-2">
            {menuItems.map((item) => (
              <li key={item}>
                <NavLink
                  to={`/${item === "home" ? "" : item}`}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block text-center text-sm font-semibold uppercase tracking-wide py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-yellow-500 text-black shadow-lg"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
