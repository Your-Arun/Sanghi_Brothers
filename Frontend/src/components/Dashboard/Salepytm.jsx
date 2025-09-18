import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

const SalePaytm = () => {
  const [rows, setRows] = useState(
    Array(6).fill({ name: "", sale: "", paytm: "" })
  );
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [filterDate, setFilterDate] = useState("");

  // Handle row change
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  // Totals
  const totalSale = rows.reduce((acc, r) => acc + (parseFloat(r.sale) || 0), 0);
  const totalPaytm = rows.reduce(
    (acc, r) => acc + (parseFloat(r.paytm) || 0),
    0
  );

  // Save data
  const handleSave = async () => {
    if (!date) return alert("Date required!");
    try {
      await axiosInstance.post("/salepaytm", { date, rows });
      setRows(Array(6).fill({ name: "", sale: "", paytm: "" })); // reset
      fetchEntries();
    } catch (err) {
      alert("Error saving data");
    }
  };

  // Fetch data
  const fetchEntries = async () => {
    try {
      const res = await axiosInstance.get("/salepaytm", {
        params: filterDate ? { date: filterDate } : {},
      });
      setEntries(res.data);
    } catch (err) {
      alert("Error fetching data");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [filterDate]);

  // Delete entry
  const handleDelete = async (id) => {
    await axiosInstance.delete(`/salepaytm/${id}`);
    fetchEntries();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Sale / Paytm</h1>

      {/* Date + Save */}
      <div className="mb-4 flex gap-4 justify-end">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>

      {/* Table */}
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
            <td className="border p-2" colSpan={2}>
              Total
            </td>
            <td className="border p-2">{totalSale}</td>
            <td className="border p-2">{totalPaytm}</td>
          </tr>
        </tbody>
      </table>

      {/* Filter */}
      <div className="mb-4 flex gap-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={fetchEntries}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Search
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="bg-white p-4 shadow rounded border relative"
          >
            <p className="text-sm text-gray-500 mb-2">
              Date: {new Date(entry.date).toLocaleDateString()}
            </p>

            {/* Each nozzle row */}
            <div className="space-y-2">
              {entry.rows.map((r, idx) => (
                <div
                  key={idx}
                  className="flex justify-between border-b pb-1 text-sm"
                >
                  <span>
                    <b>Nozzle {idx + 1}</b> - {r.name || "—"}
                  </span>
                  <span>Sale: {r.sale || 0}</span>
                  <span>Paytm: {r.paytm || 0}</span>
                </div>
              ))}
            </div>

            {/* Delete button */}
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
