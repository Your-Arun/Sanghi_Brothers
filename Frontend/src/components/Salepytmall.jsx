import React, { useEffect, useState } from "react";
import axiosInstance from "./Dashboard/axiosInstance";

const SalePaytm = () => {
  const [salepaytm, setSalePaytm] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("salepaytm"); // 🔹 API endpoint change kar lena
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
                    ₹{entry.totalSale}
                  </td>
                  <td className="border p-2 text-yellow-700 font-medium text-right">
                    ₹{entry.totalPaytm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalePaytm;
