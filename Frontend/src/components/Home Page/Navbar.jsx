import React from 'react';
import { NavLink } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
    return (
        <nav className="bg-black shadow-md">
            <div className="flex items-center justify-between px-4">
                {/* Left Section - Logo */}
                <div className="bg-yellow-500 px-6 py-4 flex items-center">
                    <div className="text-black font-semibold text-xl flex items-center">
                        <span className="mr-2">⛽</span> {/* Icon placeholder */}
                        Sanghi Brothers
                    </div>
                </div>

                {/* Center Menu */}
                <ul className="hidden md:flex space-x-8 text-white text-sm font-medium tracking-wide uppercase mx-auto">
                    {['home', 'about', 'services','contact'].map((item) => (
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

                {/* Right - Search Icon */}
                <div className="text-white px-6">
                    <CiSearch className="text-xl cursor-pointer" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
