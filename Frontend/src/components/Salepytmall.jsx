import React, { useEffect, useState } from "react";
import axiosInstance from "./Dashboard/axiosInstance";
import BackButton from "./Home Page/BackButtonn";

const SalePaytm = () => {
  const [salepaytm, setSalePaytm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // 🔹 details ke liye

  // Fetch data on mount
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
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-center mb-6">📊 Sale & Paytm Records</h2>

      {salepaytm.length === 0 ? (
        <p className="text-center text-gray-500">No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg text-sm md:text-base table-fixed">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border p-2 w-16 text-center">SNo.</th>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Shift</th>
                <th className="border p-2 text-right">Total Sale</th>
                <th className="border p-2 text-right">Total Paytm</th>
                <th className="border p-2 text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {salepaytm.map((entry, idx) => (
                <tr key={entry._id || idx} className="hover:bg-gray-50 transition">
                  <td className="border p-2 text-center">{idx + 1}</td>
                  <td className="border p-2 text-left">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="border p-2 text-left">{entry.shift}</td>
                  <td className="border p-2 text-green-700 font-medium text-right">
                    {entry.totalSale}
                  </td>
                  <td className="border p-2 text-yellow-700 font-medium text-right">
                    ₹{entry.totalPaytm}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => setSelected(entry)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Modal for details */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] shadow-2xl overflow-y-auto">
            {/* Close button */}
            <div
              onClick={() => setSelected(null)}
              className="float-right text-red-600 font-bold text-xl cursor-pointer"
            >
              ✕
            </div>

            {/* Heading */}
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center text-gray-800">
              📅 {new Date(selected.date).toLocaleDateString()} ({selected.shift})
            </h3>

            {/* Compact rows view */}
            <div className="space-y-1 max-h-64 overflow-y-auto border rounded p-3 bg-gray-50">
              {selected.rows.map((r, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-1">
                  <span className="truncate w-24">{idx + 1}. {r.name || "—"}</span>
                  <span className="text-green-600">{r.sale || 0}</span>
                  <span className="text-yellow-600">₹{r.paytm || 0}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 text-center">
              <p className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg">
                Total Sale: <span className="text-green-700">{selected.totalSale}</span> |{" "}
                Total Paytm: <span className="text-yellow-700">₹{selected.totalPaytm}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <BackButton label="Back Button"/>
    </div>
  );
};

export default SalePaytm;
