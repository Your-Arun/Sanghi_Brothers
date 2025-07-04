import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    const menuItems = ['home', 'about', 'services', 'contact'];

    return (
        <nav className="bg-black shadow-md">
            <div className="flex items-center justify-between px-4 py-3 md:py-0">
                {/* Left Logo */}
                <div className="px-6 py-3 flex items-center">
                    <span className="text-white font-semibold text-xl flex items-center">
                        <span className="mr-2">⛽</span> Sanghi Brothers
                    </span>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-8 text-white text-sm font-medium uppercase mx-auto">
                    {menuItems.map(item => (
                        <li key={item}>
                            <NavLink
                                to={`/${item === 'home' ? '' : item}`}
                                className={({ isActive }) =>
                                    `hover:text-yellow-500 transition duration-300 ${isActive ? 'text-yellow-500' : ''}`
                                }
                            >
                                {item}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Search and Mobile Menu Toggle */}
                <div className="flex items-center gap-4 text-white">
                    <CiSearch className="text-xl cursor-pointer" />
                    <button
                        className="md:hidden text-2xl focus:outline-none"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-black px-6 pb-4">
                    <ul className="flex flex-col space-y-4 text-white text-sm font-medium uppercase">
                        {menuItems.map(item => (
                            <li key={item}>
                                <NavLink
                                    to={`/${item === 'home' ? '' : item}`}
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `block hover:text-yellow-500 transition duration-300 ${isActive ? 'text-yellow-500' : ''}`
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
