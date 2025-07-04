import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');

    const menuItems = ['home', 'about', 'services', 'contact'];
    const searchData = ['Home', 'About Us', 'Contact', 'Services', 'Team', 'Booking', 'Customer Support'];

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);
    const toggleSearch = () => setSearchOpen(!searchOpen);

    const filteredResults = searchData.filter(item =>
        item.toLowerCase().includes(query.toLowerCase()) && query.trim() !== ''
    );

    return (
        <nav className="bg-black shadow-md relative z-50">
            <div className="flex items-center justify-between px-4 py-3 md:py-0">
                {/* Logo */}
                <div className="px-6 py-3 flex items-center">
                    <span className="text-white font-bold text-2xl flex items-center">
                        <span className="mr-2">⛽</span> SANGHI BROTHER<span className='text-yellow-500'>S</span>
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

                {/* Search + Mobile Toggle */}
                <div className="flex items-center gap-4 text-white relative">
                    <button onClick={toggleSearch}>
                        <CiSearch className="text-xl cursor-pointer" />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-2xl focus:outline-none"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>

                    {/* Search Input Box */}
                    {searchOpen && (
                        <div className="absolute right-0 top-10 bg-white text-black p-3 rounded shadow-md w-64">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full border px-3 py-2 rounded outline-none"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            {filteredResults.length > 0 ? (
                                <ul className="mt-2 max-h-40 overflow-y-auto text-sm">
                                    {filteredResults.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="p-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={() => {
                                                setQuery(item);
                                                setSearchOpen(false);
                                            }}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : query && (
                                <p className="text-gray-500 text-sm mt-2">No results found</p>
                            )}
                        </div>
                    )}
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
