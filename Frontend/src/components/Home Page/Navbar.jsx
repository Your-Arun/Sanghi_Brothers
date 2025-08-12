import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = ['home', 'about', 'services', 'contact'];

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="bg-black shadow-md relative z-50">
            <div className="flex items-center justify-between px-6 py-3">
                
                {/* Logo */}
                <div className="flex items-center">
                    <span className="text-white font-bold text-2xl flex items-center">
                        <span className="mr-2 text-4xl">⛽</span> 
                        SANGHI BROTHERS
                    </span>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-8 text-white text-sm font-medium uppercase">
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

                {/* Mobile Menu Toggle */}
                <div
                    className="md:hidden text-2xl text-white focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
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
