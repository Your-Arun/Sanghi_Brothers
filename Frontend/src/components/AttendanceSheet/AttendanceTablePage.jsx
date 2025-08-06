// import React, { useEffect, useState } from "react";
// import axiosInstance from "../Dashboard/axiosInstance";

// const AttendanceTablePage = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [loading, setLoading] = useState(false);

//   const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();
//   const days = getDaysInMonth(year, month);

//   const fetchMonthlyAttendance = async () => {
//     setLoading(true);
//     try {
//       const daysInMonth = getDaysInMonth(year, month);
//       const dailyLogs = [];

//       for (let day = 1; day <= daysInMonth; day++) {
//         const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//         const res = await axiosInstance.get(`/daily-attendance?date=${date}`);
//         dailyLogs.push({ date, data: res.data });
//       }

//       const attendanceMap = {};

//       dailyLogs.forEach(({ date, data }) => {
//         data.forEach((entry) => {
//           const uid = entry._id;
//           if (!attendanceMap[uid]) {
//             attendanceMap[uid] = {
//               _id: uid,
//               name: entry.name,
//               designation: entry.designation,
//               attendance: {},
//             };
//           }
//           attendanceMap[uid].attendance[date] = entry.status === "Present";
//         });
//       });

//       const formattedData = Object.values(attendanceMap);
//       setAttendanceData(formattedData);
//     } catch (err) {
//       console.error("Error fetching attendance:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMonthlyAttendance();
//   }, [month, year]);

//   return (
//     <div className="p-6 bg-gray-900 text-white min-h-screen">
//       <h1 className="text-3xl font-bold mb-4">📅 Monthly Attendance Table</h1>

//       {/* Filter Controls */}
//       <div className="flex gap-4 items-center mb-6">
//         <select
//           value={year}
//           onChange={(e) => setYear(Number(e.target.value))}
//           className="bg-gray-700 px-4 py-2 rounded"
//         >
//           {[2023, 2024, 2025].map((y) => (
//             <option key={y} value={y}>{y}</option>
//           ))}
//         </select>

//         <select
//           value={month}
//           onChange={(e) => setMonth(Number(e.target.value))}
//           className="bg-gray-700 px-4 py-2 rounded"
//         >
//           {Array.from({ length: 12 }, (_, i) => (
//             <option key={i} value={i + 1}>
//               {new Date(0, i).toLocaleString("default", { month: "long" })}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={fetchMonthlyAttendance}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* Attendance Table */}
//       <div className="overflow-auto rounded border border-gray-700">
//         {loading ? (
//           <div className="text-center py-10 text-xl">Loading attendance data...</div>
//         ) : (
//           <table className="w-full border-collapse text-sm">
//             <thead className="bg-gray-800">
//               <tr>
//                 <th className="border border-gray-700 px-2 py-1 sticky left-0 bg-gray-800 z-20">
//                   Name
//                 </th>
//                 {Array.from({ length: days }, (_, i) => (
//                   <th key={i} className="border border-gray-700 px-1 text-center">
//                     {i + 1}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceData.map((user, idx) => (
//                 <tr key={idx}>
//                   <td className="text-white border border-gray-700 px-2 py-1 sticky left-0 bg-gray-900 z-10 whitespace-nowrap">
//                     {user.name}
//                   </td>
//                   {Array.from({ length: days }, (_, i) => {
//                     const date = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
//                     const isPresent = user.attendance[date] || false;
//                     return (
//                       <td key={i} className="border border-gray-700 px-1 text-center text-xs">
//                         {isPresent ? "✅" : "❌"}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AttendanceTablePage;



// const AttendanceTablePage = ({ data, loading }) => {
//   if (loading) return <p className="text-gray-400">⏳ Loading attendance data...</p>;

//   return (
//     <div className="bg-gray-800 p-4 rounded-md">
//       <h2 className="text-xl font-semibold mb-4">📅 Daily Attendance Table</h2>
//       {data.length === 0 ? (
//         <p className="text-gray-400">No attendance records for this date.</p>
//       ) : (
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-700">
//               <th className="p-2 border-b">Photo</th>
//               <th className="p-2 border-b">Name</th>
//               <th className="p-2 border-b">Designation</th>
//               <th className="p-2 border-b">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((entry) => (
//               <tr key={entry._id} className="hover:bg-gray-700">
//                 <td className="p-2 border-b">
//                   <img src={entry.photo || "/user-avatar.png"} alt="" className="w-10 h-10 rounded-full" />
//                 </td>
//                 <td className="p-2 border-b">{entry.name}</td>
//                 <td className="p-2 border-b">{entry.designation}</td>
//                 <td className="p-2 border-b">{entry.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AttendanceTablePage;




import React, { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";

const AttendanceTablePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const days = getDaysInMonth(year, month);

  const fetchMonthlyAttendance = async () => {
    setLoading(true);
    try {
      const dailyLogs = [];

      // Request sabhi din ke attendance ek-ek kar ke
      const requests = Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return axiosInstance.get(`/daily-attendance?date=${date}`).then((res) => ({
          date,
          data: res.data,
        }));
      });

      const results = await Promise.all(requests);
      const attendanceMap = {};

      results.forEach(({ date, data }) => {
        data.forEach((entry) => {
          const uid = entry._id;
          if (!attendanceMap[uid]) {
            attendanceMap[uid] = {
              _id: uid,
              name: entry.name,
              photo: entry.photo,
              designation: entry.designation,
              attendance: {},
            };
          }
          attendanceMap[uid].attendance[date] = entry.status;
        });
      });

      const formattedData = Object.values(attendanceMap);
      setAttendanceData(formattedData);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [month, year]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📆 Monthly Attendance Table</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <button
          onClick={fetchMonthlyAttendance}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border border-gray-800 rounded">
        {loading ? (
          <div className="text-center text-gray-300 py-10">Loading attendance data...</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-800">
              <tr>
                <th className="sticky left-0 bg-gray-800 px-2 py-1 border border-gray-700">Photo</th>
                <th className="sticky left-0 bg-gray-800 px-2 py-1 border border-gray-700">Name</th>
                <th className="px-2 py-1 border border-gray-700">Designation</th>
                {Array.from({ length: days }, (_, i) => (
                  <th key={i} className="px-2 py-1 border border-gray-700 text-center">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-800">
                  <td className="sticky left-0 bg-gray-900 px-2 py-1 border border-gray-700">
                    <img
                      src={user.photo || "/user-avatar.png"}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td className="sticky left-0 bg-gray-900 px-2 py-1 border border-gray-700 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-2 py-1 border border-gray-700">{user.designation}</td>
                  {Array.from({ length: days }, (_, i) => {
                    const date = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                    const status = user.attendance[date];

                    return (
                      <td
                        key={i}
                        className={`px-2 py-1 border border-gray-700 text-center ${
                          status === "Leave" ? "text-yellow-400" : status === "Present" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {status === "Present" ? "✅" : status === "Leave" ? "🟡" : "❌"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceTablePage;

