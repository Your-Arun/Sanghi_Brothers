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

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };


    return (
        <nav className="bg-gradient-to-r from-blue-800 to-yellow-800 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Heading */}
                <div className="text-white text-4xl md:text-3xl font-serif flex-1 text-center md:text-left">
                    <span className="text-white">SANGHI BROTHERS</span>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden text-white focus:outline-none absolute top-20 right-2"
                >
                    <CiBoxList className="text-4xl" />
                </button>
            </div>
            <ul className={`md:flex text-2xl space-x-8 justify-center ${isDesktopMenuOpen ? 'flex' : 'hidden'} md:items-center`}>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-wheat hover:bg-gray-300  hover:text-wheat-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                        }
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `text-wheat hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                        }
                    >
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/services"
                        className={({ isActive }) =>
                            `text-wheat hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                        }
                    >
                        Services
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `text-wheat hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                        }
                    >
                        Contact
                    </NavLink>
                </li>
            </ul>
            {/* Mobile Menu */}
            <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <ul className="flex flex-col">
                    <li>
                        <NavLink
                            to="/"
                            onClick={closeMobileMenu}
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
                            onClick={closeMobileMenu}
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
                            onClick={closeMobileMenu}
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
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                `block text-white hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Contact
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav >
    );
};

export default Navbar;