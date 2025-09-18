import React, { useState } from "react";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalePaytm = () => {
  const [rows, setRows] = useState(Array(6).fill({ name: "", sale: "", paytm: "" }));
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("Morning");
  const [entries, setEntries] = useState([]);

  // Handle row change
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  // Totals (for input table only)
  const totalSale = rows.reduce((acc, r) => acc + (parseFloat(r.sale) || 0), 0);
  const totalPaytm = rows.reduce((acc, r) => acc + (parseFloat(r.paytm) || 0), 0);

  // Save data
  const handleSave = async () => {
    if (!date) return toast.error("⚠️ Date required!");
    try {
      const res = await axiosInstance.post("/salepaytm", { date, shift, rows });
      toast.success("✅ Data saved successfully!");
      setRows(Array(6).fill({ name: "", sale: "", paytm: "" })); // reset

      // add new entry to state directly
      setEntries((prev) => [res.data, ...prev]);
    } catch (err) {
      toast.error("❌ Error saving data");
    }
  };

  // Delete entry
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/salepaytm/${id}`);
      toast.info("🗑 Entry deleted");
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error("❌ Error deleting entry");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Sale / Paytm</h1>

      {/* Date + Shift + Save */}
      <div className="mb-4 flex gap-4 justify-end">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Shift</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
        </select>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>

      {/* Input Table */}
      <table className="w-full border text-center mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Nozzle</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Sale</th>
            <th className="border p-2">Paytm</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleChange(i, "name", e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                  placeholder="Enter Name"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={row.sale}
                  onChange={(e) => handleChange(i, "sale", e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={row.paytm}
                  onChange={(e) => handleChange(i, "paytm", e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-bold">
            <td className="border p-2" colSpan={2}>Total</td>
            <td className="border p-2">{totalSale}</td>
            <td className="border p-2">{totalPaytm}</td>
          </tr>
        </tbody>
      </table>

      {/* Entries in Card Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="bg-white p-4 shadow rounded border relative"
          >
            <p className="text-sm text-gray-500 mb-2">
              Date: {new Date(entry.date).toLocaleDateString()} | Shift:{" "}
              <b>{entry.shift}</b>
            </p>

            {/* Table inside card */}
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Nozzle</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Sale</th>
                  <th className="border px-2 py-1">Paytm</th>
                </tr>
              </thead>
              <tbody>
                {entry.rows.map((r, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{idx + 1}</td>
                    <td className="border px-2 py-1">{r.name || "—"}</td>
                    <td className="border px-2 py-1">{r.sale || 0}</td>
                    <td className="border px-2 py-1">{r.paytm || 0}</td>
                  </tr>
                ))}
                <tr className="bg-yellow-100 font-bold">
                  <td className="border px-2 py-1" colSpan={2}>Total</td>
                  <td className="border px-2 py-1">{entry.totalSale}</td>
                  <td className="border px-2 py-1">{entry.totalPaytm}</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => handleDelete(entry._id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalePaytm;
