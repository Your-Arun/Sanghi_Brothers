import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaCalendarAlt, 
  FaTrash, 
  FaEye, 
  FaFileSignature 
} from "react-icons/fa";

const ChekList = () => {
    const [pumpSheetData, setPumpSheetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPumpSheetData = async () => {
            try {
                const response = await axiosInstance.get("/newlekhajokha");
                setPumpSheetData(response.data);
            } catch (error) {
                toast.warn("Error fetching data!");
            } finally {
                setLoading(false);
            }
        };
        fetchPumpSheetData();
    }, []);

    const confirmDeleteToast = (onConfirm) => {
        toast(
          ({ closeToast }) => (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-gray-800">Are you sure you want to delete this?</p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => {
                    onConfirm();
                    closeToast();
                  }}
                  className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={closeToast}
                  className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
          }
        )
    };

    const handleDelete = async (id) => {
        confirmDeleteToast(async () => {
            try {
                await axiosInstance.delete(`/newlekhajokha/${id}`);
                toast.success("Report deleted successfully!");
                setPumpSheetData((prev) => prev.filter((pump) => pump._id !== id));
            } catch (error) {
                toast.error("Error deleting report!");
            }
        });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-blue-600 font-medium">
            Loading Reports...
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
                            <FaFileSignature className="text-blue-600" />
                            Lekha Jokha
                        </h1>
                    </div>
                    
                    <Link
                        to="/newlekhajokha"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg transform active:scale-95"
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
                            <div 
                                key={pump._id} 
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
                            >
                                {/* Card Header */}
                                <div className="bg-blue-50 px-5 py-3 border-b border-blue-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-blue-800 font-semibold">
                                        <FaCalendarAlt />
                                        <span>
                                            {new Date(pump.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    {/* Optional: Add Shift or other info here if available */}
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1">
                                    <h4 className="text-lg font-bold text-gray-800 mb-1">
                                        {pump.username ? pump.username : "Daily Report"}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {pump.department ? pump.department : "Pump Sheet Entry"}
                                    </p>
                                </div>

                                {/* Card Actions */}
                                <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
                                    <Link to={`/newlekhajokha/${pump._id}`} className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition text-sm font-medium">
                                            <FaEye /> View
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(pump._id)} 
                                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-red-500 py-2 rounded-lg hover:bg-red-50 hover:border-red-200 transition text-sm font-medium"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* --- Empty State --- */
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                        <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
                            <FaFileSignature size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No Reports Found</h3>
                        <p className="text-gray-500 text-sm mb-6">Get started by creating a new Lekha Jokha report.</p>
                        <Link
                            to="/newlekhajokha"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
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