import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CiBoxList } from "react-icons/ci";

const Navbar = () => {
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleDesktopMenu = () => {
        setIsDesktopMenuOpen(!isDesktopMenuOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-6xl md:text-4xl sm:text-3xl xs:text-2xl mb-8 font-sm font-serif" style={{ fontSize: '6vw' }}>SANGHI BROTHERS</div>
             <ul className={`md:flex text-2xl space-x-8 ${isDesktopMenuOpen ? 'flex' : 'hidden'} md:items-center`}>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `text-blue hover:bg-gray-300  hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `text-blue hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/services"
                            className={({ isActive }) =>
                                `text-blue hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Services
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `text-blue hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Contact
                        </NavLink>
                    </li>
                </ul>
                {/* Mobile Menu Button (Visible only on small screens) */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden text-white focus:outline-none ml-auto mr-4"
                >
                    <CiBoxList className="text-3xl" />
                </button>
            </div>
            {/* Mobile Menu */}
            <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <ul className="flex flex-col space-y-2 mt-4">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `block text-white hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `block text-white hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/services"
                            className={({ isActive }) =>
                                `block text-white hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Services
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `block text-white hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Contact
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;