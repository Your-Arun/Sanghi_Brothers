import axiosInstance from '../Dashboard/axiosInstance';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaPlus, 
  FaUniversity, 
  FaExchangeAlt, 
  FaCalendarAlt, 
  FaChevronRight, 
  FaSearch 
} from "react-icons/fa";
import { toast } from 'react-toastify';

const MergeSBInflo = () => {
  const [sbiUpdate, setSbiUpdate] = useState([]);
  const [inOutFlow, setInOutFlow] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          // Optional: redirect logic here if needed
        }

        const [sbiResponse, flowResponse] = await Promise.all([
          axiosInstance.get("/fundposition"),
          axiosInstance.get("/bank/monthlyflow")
        ]);

        setSbiUpdate(sbiResponse.data);
        setInOutFlow(flowResponse.data);
      } catch (error) {
        toast.warn("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reusable Component for List Items
  const ReportCard = ({ item, type, colorClass, icon: Icon, link }) => (
    <Link
      to={link}
      className={`group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between
      ${type === 'fund' ? 'hover:border-indigo-200' : 'hover:border-emerald-200'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${colorClass} text-white shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon size={16} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm">
            {item.username || item.User || "Unknown User"}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
            <FaCalendarAlt />
            {item.inputs?.date1 
              ? new Date(item.inputs.date1).toLocaleDateString("en-GB") 
              : "No Date"}
          </div>
        </div>
      </div>
      <FaChevronRight className="text-gray-300 group-hover:text-gray-600 transition-colors text-xs" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Bank Operations</h1>
            <p className="text-xs text-gray-500">Manage Fund Positions & In-Out Flows</p>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {loading ? (
           <div className="text-center py-20 text-gray-500 font-medium">Loading reports...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* --- LEFT COLUMN: FUND POSITION --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-indigo-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <FaUniversity className="text-indigo-600 text-xl" />
                   <h2 className="text-lg font-bold text-gray-800">Fund Position</h2>
                </div>
                <Link
                  to="/fundposition"
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-indigo-700 transition shadow-md hover:shadow-lg active:scale-95"
                >
                  <FaPlus /> New Report
                </Link>
              </div>

              {/* List */}
              <div className="p-6 bg-gray-50/50 flex-1">
                {sbiUpdate.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sbiUpdate.map((item) => (
                      <ReportCard 
                        key={item._id} 
                        item={item} 
                        type="fund"
                        colorClass="bg-indigo-500" 
                        icon={FaUniversity} 
                        link={`/fundposition/${item._id}`} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <FaSearch className="mb-2 text-2xl" />
                    <p>No Fund Position reports found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* --- RIGHT COLUMN: IN-OUT FLOW --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-emerald-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <FaExchangeAlt className="text-emerald-600 text-xl" />
                   <h2 className="text-lg font-bold text-gray-800">In-Out Flow</h2>
                </div>
                <Link
                  to="/bank/monthlyflow"
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-emerald-700 transition shadow-md hover:shadow-lg active:scale-95"
                >
                  <FaPlus /> New Entry
                </Link>
              </div>

              {/* List */}
              <div className="p-6 bg-gray-50/50 flex-1">
                {inOutFlow.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {inOutFlow.map((item) => (
                      <ReportCard 
                        key={item._id} 
                        item={item} 
                        type="flow"
                        colorClass="bg-emerald-500" 
                        icon={FaExchangeAlt} 
                        link={`/bank/monthlyflow/${item._id}`} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <FaSearch className="mb-2 text-2xl" />
                    <p>No In-Out Flow records found.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MergeSBInflo;