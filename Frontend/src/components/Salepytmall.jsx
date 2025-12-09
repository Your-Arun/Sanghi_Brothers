import React, { useEffect, useState } from "react";
import axiosInstance from "./Dashboard/axiosInstance";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaClock, 
  FaChartLine, 
  FaWallet, 
  FaEye, 
  FaTimes 
} from "react-icons/fa";

const SalePaytm = () => {
  const navigate = useNavigate();
  const [salepaytm, setSalePaytm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("salepaytm");
        setSalePaytm(res.data);
      } catch (err) {
        console.error("Error fetching SalePaytm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Loading records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Sale & Paytm Records</h1>
            <p className="text-xs text-gray-500">Track daily sales and digital payments</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {salepaytm.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3 text-gray-400">
               <FaChartLine size={24} />
            </div>
            <p className="text-gray-500 font-medium">No records found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {salepaytm.map((entry, idx) => (
              <div 
                key={entry._id || idx} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaCalendarAlt className="text-gray-400" />
                    {new Date(entry.date).toLocaleDateString('en-GB')}
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded flex items-center gap-1">
                    <FaClock size={10} /> {entry.shift}
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-3 mb-5 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <FaChartLine className="text-green-500" /> Total Sale
                    </span>
                    <span className="font-bold text-gray-800 text-lg">
                      {entry.totalSale} L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <FaWallet className="text-blue-500" /> Total Paytm
                    </span>
                    <span className="font-bold text-gray-800 text-lg">
                      ₹{entry.totalPaytm}
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  onClick={() => setSelected(entry)}
                  className="w-full mt-auto flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition"
                >
                  <FaEye /> View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DETAILS MODAL --- */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Record Details
                </h3>
                <p className="text-xs text-gray-500">
                  {new Date(selected.date).toLocaleDateString('en-GB')} • {selected.shift}
                </p>
              </div>
              <button 
                onClick={() => setSelected(null)}
                className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body (Scrollable Rows) */}
            <div className="p-6 overflow-y-auto bg-gray-50/30 flex-1">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Nozzle Breakdown</h4>
              <div className="space-y-2">
                {selected.rows.map((r, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                        {r.name || "Nozzle"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded mb-1 inline-block">
                        {r.sale || 0} L
                      </div>
                      <div className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded inline-block ml-2">
                        ₹{r.paytm || 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer (Totals) */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div className="text-center w-1/2 border-r border-indigo-200">
                  <p className="text-xs text-indigo-500 font-bold uppercase">Total Sale</p>
                  <p className="text-xl font-bold text-gray-900">{selected.totalSale}</p>
                </div>
                <div className="text-center w-1/2">
                  <p className="text-xs text-indigo-500 font-bold uppercase">Total Paytm</p>
                  <p className="text-xl font-bold text-gray-900">₹{selected.totalPaytm}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SalePaytm;