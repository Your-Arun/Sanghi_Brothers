import React, { useState, useEffect } from "react";
import axiosInstance from '../Dashboard/axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2, Calendar, Clock } from "lucide-react";

const AllShifts = () => {
  const [maps, setMaps] = useState([]);
  const [filteredMaps, setFilteredMaps] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllMaps();
  }, []);

  // --- FETCH ALL SAVED MAPS ---
  const fetchAllMaps = async () => {
    try {
      setLoading(true);
      // Note: Route name wahi hona chahiye jo backend me set kiya hai (/shifting/all-maps)
      const response = await axiosInstance.get("/all-maps");
      
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

  // --- FILTER BY DATE ---
  const handleFilterChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);

    if (date === "") {
      setFilteredMaps(maps);
    } else {
      // Database me date string format me hai (YYYY-MM-DD)
      setFilteredMaps(maps.filter((map) => map.date === date));
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const response = await axiosInstance.delete(`/shifting/delete-map/${id}`);
      if (response.data.success) {
        toast.success("Report Deleted");
        setMaps((prev) => prev.filter((map) => map._id !== id));
        setFilteredMaps((prev) => prev.filter((map) => map._id !== id));
      }
    } catch (error) {
      console.error("Error deleting map:", error);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button
            className="self-start bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition font-bold shadow-sm"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
            Shift Reports Gallery
          </h2>

          {/* Date Filter */}
          <input
            type="date"
            className="p-3 border border-gray-300 rounded-xl shadow-sm outline-none focus:ring-2 ring-blue-500 font-semibold text-gray-600"
            value={selectedDate}
            onChange={handleFilterChange}
          />
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Loading Reports...</div>
        ) : filteredMaps.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-bold">No reports found for this date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaps.map((map) => (
              <div key={map._id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                
                {/* Image Container */}
                <div className="relative group bg-gray-100 aspect-square border-b border-gray-100">
                  <img 
                    src={map.image} 
                    alt={`Report ${map.date}`} 
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Download Overlay (Optional) */}
                  <a 
                    href={map.image} 
                    download={`Report_${map.date}.jpg`}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">Download / View</span>
                  </a>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                          <Calendar size={14} /> {map.date}
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 text-sm font-black uppercase tracking-wider">
                          <Clock size={14} /> {map.shift} Shift
                        </div>
                      </div>
                      
                      <div
                        onClick={() => handleDelete(map._id)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition"
                        title="Delete Report"
                      >
                        <Trash2 size={20} />
                      </div>
                    </div>

                    {/* Caption if exists */}
                    {map.caption && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <p className="text-gray-600 text-sm italic font-medium">
                          "{map.caption}"
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 text-[10px] text-center text-gray-300 font-bold uppercase">
                    Pump Manager Report
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllShifts;







































































































// import React, { useState, useEffect } from "react";
// import axiosInstance from '../Dashboard/axiosInstance'
// import { useNavigate } from "react-router-dom"; // 👈 Navigation ke liye import
// import { toast } from "react-toastify";

// const AllShifts = () => {
//   const [shifts, setShifts] = useState([]);
//   const [filteredShifts, setFilteredShifts] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");

//   const navigate = useNavigate(); // 👈 Navigation function

//   useEffect(() => {
//     fetchAllShifts();
//   }, []);

//   const fetchAllShifts = async () => {
//     try {
//       const response = await axiosInstance.get("/allshifts");
//       if (response.data.success && Array.isArray(response.data.shifts)) {
//         const sortedShifts = response.data.shifts.sort((a, b) => new Date(b.date) - new Date(a.date));
//         setShifts(sortedShifts);
//         setFilteredShifts(sortedShifts);
//       } else {
//         setShifts([]);
//         setFilteredShifts([]);
//       }
//     } catch (error) {
//       console.error("Error fetching shifts:", error);
//       setShifts([]);
//       setFilteredShifts([]);
//     }
//   };
//   const confirmDeleteToast = (onConfirm) => {
//     toast(
//       ({ closeToast }) => (
//         <div className="flex flex-col gap-2">
//           <p>Are you sure you want to delete this ?</p>
//           <div className="flex gap-4 mt-2">
//             <button
//               onClick={() => {
//                 onConfirm()
//                 closeToast()
//               }}
//               className="bg-red-500 text-white px-3 py-1 rounded"
//             >
//               Yes
//             </button>
//             <button
//               onClick={closeToast}
//               className="bg-gray-300 px-3 py-1 rounded"
//             >
//               No
//             </button>
//           </div>
//         </div>
//       ),
//       {
//         position: "top-center",
//         autoClose: false,
//         closeOnClick: false,
//         closeButton: false,
//       }
//     )
//   }
//   const handleDelete = async (id) => {
//     confirmDeleteToast(async () => {
//       try {
//         const response = await axiosInstance.delete(`/shift/${id}`);
//         if (response.data.success) {
//           setShifts((prevShifts) => prevShifts.filter((shift) => shift._id !== id));
//           setFilteredShifts((prevShifts) => prevShifts.filter((shift) => shift._id !== id));
//         }
//       } catch (error) {
//         console.error("Error deleting shift:", error);
//       }
//     })
//   }

//   const handleFilterChange = (event) => {
//     const date = event.target.value;
//     setSelectedDate(date);

//     if (date === "") {
//       setFilteredShifts(shifts);
//     } else {
//       setFilteredShifts(shifts.filter((shift) => shift.date === date));
//     }
//   };

//   return (
//     <div className="container mx-auto p-5">
//       {/* Back Button */}
//       <button
//         className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-700 transition"
//         onClick={() => navigate(-1)} // 👈 Pichhle page pe jaane ka function
//       >
//         ← Back
//       </button>

//       <h2 className="text-2xl font-bold text-center mb-4">All Shifts</h2>

//       {/* Date Filter */}
//       <div className="mb-4 text-center">
//         <input
//           type="date"
//           className="p-2 border rounded"
//           value={selectedDate}
//           onChange={handleFilterChange}
//         />
//       </div>

//       {filteredShifts.length === 0 ? (
//         <p className="text-center text-gray-500">No shifts available</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {filteredShifts.map((shift) => (
//             <div key={shift._id} className="bg-white shadow-md p-5 rounded-lg relative">
//               <button
//                 className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-xs"
//                 onClick={() => handleDelete(shift._id)}
//               >
//                 Delete
//               </button>

//               <h3 className="text-xl font-bold text-center">{shift.shiftType}</h3>
//               <p className="text-center text-gray-600">{shift.date}</p>
//               <p className="text-center font-medium text-indigo-600">
//                 {shift.startTime} - {shift.endTime}
//               </p>

//               <div className="flex justify-evenly mt-3">
//                 <p className="font-semibold">Supervisor: <span className="text-red-800">{shift.supervisor}</span></p>
//                 <p className="font-semibold">Extra Operator: <span className="text-red-800">{shift.extraOperator}</span></p>
//                 <p className="font-semibold">Air Boy: <span className="text-red-800">{shift.airBoy}</span></p>
//               </div>

//               <div className="overflow-x-auto">
//                     <table className="w-full min-w-[300px] table-fixed border border-gray-300 text-sm rounded-lg">
//                      <thead>
//                     <tr className="bg-gray-200 text-gray-800">
//                       <th className="py-2 px-3 border">Nozzle</th>
//                       <th className="py-2 px-3 border">Member</th>
//                       <th className="py-2 px-3 border">Overtime</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {shift.nozzles.map((nozzle, index) => (
//                       <tr key={index} className="hover:bg-gray-100 transition">
//                         <td className="py-2 px-3 border text-center">{nozzle.nozzleNumber}</td>
//                         <td className="py-2 px-3 border text-center">{nozzle.member}</td>
//                         <td className="py-2 px-3 border text-center">
//                           <span
//                             className={`px-2 py-1 rounded-lg text-xs font-bold ${nozzle.overtime ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                               }`}
//                           >
//                             {nozzle.overtime ? "Overtime ✅" : "❌ Overtime"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllShifts;