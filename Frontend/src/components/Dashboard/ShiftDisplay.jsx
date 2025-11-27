import React, { useState, useEffect } from "react";
import axiosInstance from '../Dashboard/axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2, Calendar, Clock, Download, Eye, X, Search } from "lucide-react";

const AllShifts = () => {
  const [maps, setMaps] = useState([]);
  const [filteredMaps, setFilteredMaps] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedMap, setSelectedMap] = useState(null); // For View Modal

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllMaps();
  }, []);

  const fetchAllMaps = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/shifting/all-maps");
      if (response.data.success) {
        setMaps(response.data.maps);
        setFilteredMaps(response.data.maps);
      }
    } catch (error) {
      console.error("Error fetching maps:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    if (date === "") {
      setFilteredMaps(maps);
    } else {
      setFilteredMaps(maps.filter((map) => map.date === date));
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Click event bubble na ho
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const response = await axiosInstance.delete(`/shifting/delete-map/${id}`);
      if (response.data.success) {
        toast.success("Report Deleted");
        const updated = maps.filter((map) => map._id !== id);
        setMaps(updated);
        setFilteredMaps(updated);
        if (selectedMap && selectedMap._id === id) setSelectedMap(null); // Close modal if open
      }
    } catch (error) {
      console.error("Error deleting map:", error);
      toast.error("Failed to delete");
    }
  };

  // --- FORCE DOWNLOAD HELPER ---
  const handleDownload = async (e, imageUrl, filename) => {
    e.stopPropagation(); // Modal na khule
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download Started");
    } catch (err) {
      console.error("Download Error", err);
      toast.error("Download failed. Try opening image.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-gray-800">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <button
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Calendar className="text-blue-600" /> Shift Gallery
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-blue-500 text-slate-700 font-bold"
              value={selectedDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Loading Reports...</div>
        ) : filteredMaps.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400 text-lg font-bold">No reports found.</p>
          </div>
        ) : (
          /* COMPACT GRID LAYOUT */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredMaps.map((map) => (
              <div 
                key={map._id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col cursor-pointer"
                onClick={() => setSelectedMap(map)} // Open Modal
              >
                
                {/* Thumbnail Image (Compact Height) */}
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img 
                    src={map.image} 
                    alt="Shift Report" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Hover Overlay Icon */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="text-white drop-shadow-md" size={32} />
                  </div>
                </div>

                {/* Minimal Details */}
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Calendar size={12} /> {map.date}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${map.shift === 'Morning' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {map.shift}
                    </span>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex gap-2 mt-1 border-t border-slate-100 pt-2">
                    <button
                      onClick={(e) => handleDownload(e, map.image, `Report_${map.date}.jpg`)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-bold py-1.5 rounded-lg transition-colors"
                    >
                      <Download size={14} /> Save
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, map._id)}
                      className="px-3 bg-red-50 hover:bg-red-600 hover:text-white text-red-500 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- VIEW MODAL (FULL SCREEN) --- */}
      {selectedMap && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMap(null)}
        >
          <div 
            className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b bg-slate-50">
              <div>
                <h3 className="font-black text-lg text-slate-800 uppercase flex items-center gap-2">
                  {selectedMap.shift} Shift Report
                </h3>
                <p className="text-xs text-slate-500 font-bold">{selectedMap.date}</p>
              </div>
              <button 
                onClick={() => setSelectedMap(null)}
                className="bg-white p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 border transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image Area (Scrollable) */}
            <div className="flex-1 overflow-auto bg-slate-100 p-2 flex items-center justify-center">
              <img 
                src={selectedMap.image} 
                alt="Full Report" 
                className="max-w-full h-auto object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Modal Footer (Actions) */}
            <div className="p-4 bg-white border-t flex justify-between items-center gap-4">
              <div className="text-xs text-slate-400 font-medium hidden md:block">
                {selectedMap.caption || "No caption provided."}
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={(e) => handleDelete(e, selectedMap._id)}
                  className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Delete
                </button>
                <button
                  onClick={(e) => handleDownload(e, selectedMap.image, `Report_${selectedMap.date}.jpg`)}
                  className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-200"
                >
                  <Download size={18} /> Download Image
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AllShifts;