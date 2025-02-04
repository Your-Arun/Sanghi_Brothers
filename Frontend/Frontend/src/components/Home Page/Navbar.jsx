import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-3xl mb-5 font-sm font-serif">SANGHI BROTHERS</div>
                <ul className={`md:flex space-x-8 ${isOpen ? 'flex' : 'hidden'} md:items-center`}>
                    <li>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `text-white hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/about" 
                            className={({ isActive }) => 
                                `text-white hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/services" 
                            className={({ isActive }) => 
                                `text-white hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Services
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/contact/contactus" 
                            className={({ isActive }) => 
                                `text-white hover:bg-gray-300 hover:text-blue-500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
                            }
                        >
                            Contact
                        </NavLink>
                    </li>
                </ul>
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
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
                            to="/contactuspage" 
                            className={({ isActive }) => 
                                `block text-white hover:bg-gray-300 hover:text-blue- 500 transition duration-300 p-2 rounded ${isActive ? 'bg-gray-300 text-blue-500' : ''}`
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