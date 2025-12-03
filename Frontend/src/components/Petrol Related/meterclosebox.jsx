import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaCalendarAlt, 
  FaTachometerAlt, 
  FaChevronRight,
  FaSearch
} from "react-icons/fa";

const ChekList = () => {
    const [pumpSheetData, setPumpSheetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPumpSheetData = async () => {
            try {
                const response = await axiosInstance.get("/meterclose");
                setPumpSheetData(response.data);
            } catch (error) {
                toast.warn("Error fetching meter close data.");
            } finally {
                setLoading(false);
            }
        };
        fetchPumpSheetData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-blue-600 font-medium">
            Loading Data...
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            
            {/* --- Sticky Header --- */}
            <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate("/dashboard")}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FaTachometerAlt className="text-purple-600" />
                            Meter Close
                        </h1>
                    </div>
                    
                    <Link
                        to="/meterclose"
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition shadow-md hover:shadow-lg transform active:scale-95"
                    >
                        <FaPlus /> <span className="hidden sm:inline">Create New</span>
                    </Link>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {pumpSheetData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pumpSheetData.map((pump) => (
                            <Link
                                key={pump._id}
                                to={`/meterclose/${pump._id}`}
                                className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-purple-200 transition-all duration-200"
                            >
                                <div className="p-5 flex flex-col h-full">
                                    
                                    {/* Icon & Date Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <FaTachometerAlt size={20} />
                                        </div>
                                        <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                                                <FaCalendarAlt size={10} />
                                                {new Date(pump.date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors">
                                        Closing Report
                                    </h4>
                                    <p className="text-sm text-gray-400">ID: {pump._id.slice(-6).toUpperCase()}</p>

                                    {/* Footer Arrow */}
                                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                                        <span className="text-sm font-medium text-purple-600">View Details</span>
                                        <FaChevronRight className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* --- Empty State --- */
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
                            <FaSearch size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No Reports Found</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs">
                            You haven't created any meter closing reports yet.
                        </p>
                        <Link
                            to="/meterclose"
                            className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                        >
                            Create First Report
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChekList;