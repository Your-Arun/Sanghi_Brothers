import React, { useState } from "react";

const SalePaytm = () => {
  const [rows, setRows] = useState([
    { sale: "", paytm: "" },
    { sale: "", paytm: "" },
    { sale: "", paytm: "" },
    { sale: "", paytm: "" },
    { sale: "", paytm: "" },
    { sale: "", paytm: "" },
  ]);
  const [date, setDate] = useState("");

  // Handle row value change
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Calculate totals
  const totalSale = rows.reduce((acc, r) => acc + (parseFloat(r.sale) || 0), 0);
  const totalPaytm = rows.reduce((acc, r) => acc + (parseFloat(r.paytm) || 0), 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Date Input */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center w-full">Sale / Paytm</h1>
      </div>
      <div className="flex justify-end mb-4">
        <label className="mr-2 font-medium">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Table */}
      <table className="w-full border border-gray-400 text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
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
          {/* Totals */}
          <tr className="bg-gray-100 font-bold">
            <td className="border p-2">Total</td>
            <td className="border p-2">{totalSale}</td>
            <td className="border p-2">{totalPaytm}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalePaytm;
