import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalePaytm = () => {
    const [rows, setRows] = useState(Array(6).fill({ name: "", sale: "", paytm: "" }));
    const [date, setDate] = useState("");
    const [shift, setShift] = useState("Morning");
    const [entries, setEntries] = useState([]);
    const [selected, setSelected] = useState(null);


    useEffect(() => {
        fetchEntries();
    }, []);
    const fetchEntries = async () => {
        try {
            const res = await axiosInstance.get("/salepaytm");
            setEntries(res.data);
        } catch (err) {
            toast.error("❌ Error fetching entries");
        }
    };

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
            await axiosInstance.post("/salepaytm", { date, shift, rows });
            toast.success("Data saved successfully!");
            setRows(Array(6).fill({ name: "", sale: "", paytm: "" })); // reset
        } catch (err) {
            toast.error("❌ Error saving data");
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-700">
                ⛽ Sale / Paytm
            </h1>

            {/* Date + Shift + Save */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mb-6">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full sm:w-auto focus:ring focus:ring-blue-200"
                />
                <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full sm:w-auto focus:ring focus:ring-blue-200"
                >
                    <option value="">Select Shift</option>
                    <option value="Morning">🌅 Morning</option>
                    <option value="Evening">🌙 Evening</option>
                </select>
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                    💾 Save
                </button>
            </div>

            {/* ✅ Desktop Table */}
            <div className="hidden sm:block overflow-x-auto shadow-lg rounded-lg border">
                <table className="w-full text-sm sm:text-base">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
                        <tr>
                            <th className="border p-2">Nozzle</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Sale</th>
                            <th className="border p-2">Paytm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                                <td className="border p-2">{i + 1}</td>
                                <td className="border p-2">
                                    <input
                                        type="text"
                                        value={row.name}
                                        onChange={(e) => handleChange(i, "name", e.target.value)}
                                        className="w-full px-2 py-1 border rounded-lg focus:ring focus:ring-blue-200"
                                        placeholder="Enter Name"
                                    />
                                </td>
                                <td className="border p-2">
                                    <input
                                        type="number"
                                        value={row.sale}
                                        onChange={(e) => handleChange(i, "sale", e.target.value)}
                                        className="w-full px-2 py-1 border rounded-lg focus:ring focus:ring-green-200"
                                    />
                                </td>
                                <td className="border p-2">
                                    <input
                                        type="number"
                                        value={row.paytm}
                                        onChange={(e) => handleChange(i, "paytm", e.target.value)}
                                        className="w-full px-2 py-1 border rounded-lg focus:ring focus:ring-yellow-200"
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-yellow-100 font-bold">
                            <td className="border p-2" colSpan={2}>Total</td>
                            <td className="border p-2">{totalSale}</td>
                            <td className="border p-2">{totalPaytm}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ✅ Mobile View - Card Rows */}
            <div className="sm:hidden space-y-4">
                {rows.map((row, i) => (
                    <div key={i} className="p-4 bg-white border rounded-lg shadow">
                        <h3 className="font-semibold text-gray-700 mb-2">Nozzle {i + 1}</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-gray-600">Name</label>
                                <input
                                    type="text"
                                    value={row.name}
                                    onChange={(e) => handleChange(i, "name", e.target.value)}
                                    className="w-full px-2 py-1 border rounded-lg focus:ring focus:ring-blue-200"
                                    placeholder="Enter Name"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Sale</label>
                                <input
                                    type="number"
                                    value={row.sale}
                                    onChange={(e) => handleChange(i, "sale", e.target.value)}
                                    className="w-full px-2 py-1 border rounded-lg focus:ring focus:ring-green-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Paytm</label>
                                <input
                                    type="number"
                                    value={row.paytm}
                                    onChange={(e) => handleChange(i, "paytm", e.target.value)}
                                    className="w-full px-2 py-1 border rounded-lg focus:ring focus:ring-yellow-200"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {/* ✅ Mobile Total */}
                <div className="p-4 bg-yellow-50 border rounded-lg shadow font-bold text-gray-700">
                    <div className="flex justify-between">
                        <span>Total Sale</span>
                        <span>{totalSale}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total Paytm</span>
                        <span>{totalPaytm}</span>
                    </div>
                </div>
            </div>


            {/* 🔹 Saved Entries Section */}
            {/* 🔹 Saved Entries Section */}
            <h2 className="text-lg font-semibold mt-10 mb-3 text-gray-700">📦 Back Entries</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {entries.slice(0, 6).map((entry) => (
                    <div
                        key={entry._id}
                        className="bg-white p-2 rounded-md shadow border text-[12px] transition relative"
                    >
                        {/* Date + Shift */}
                        <p className="text-gray-500 text-[11px] mb-1">
                            {new Date(entry.date).toLocaleDateString()} | <b>{entry.shift}</b>
                        </p>

                        {/* Compact rows */}
                        <div className="space-y-0.5">
                            {entry.rows.slice(0, 3).map((r, idx) => (
                                <div key={idx} className="flex justify-between text-[11px]">
                                    <span className="truncate w-14">{idx + 1}. {r.name || "—"}</span>
                                    <span className="text-green-600">₹{r.sale || 0}</span>
                                    <span className="text-yellow-600">₹{r.paytm || 0}</span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-1 border-t pt-1 font-bold text-blue-700 text-[12px]">
                            Sale: ₹{entry.totalSale} | Paytm: ₹{entry.totalPaytm}
                        </div>

                        {/* See More Button */}
                        {entry.rows.length > 3 && (
                            <button
                                className="absolute top-1 right-1 text-blue-500 text-[10px] underline"
                                onClick={() => setSelected(entry)}
                            >
                                See More
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Popup / Modal */}
            {selected && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-5 w-11/12 md:w-2/3 lg:w-1/2 shadow-xl">
                        <button
                            onClick={() => setSelected(null)}
                            className="float-right text-red-600 font-bold text-lg"
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold mb-2 text-center">
                            📅 {new Date(selected.date).toLocaleDateString()} ({selected.shift})
                        </h3>

                        {/* Table View */}
                        <table className="w-full border text-sm">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">#</th>
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Sale</th>
                                    <th className="border p-2">Paytm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selected.rows.map((r, idx) => (
                                    <tr key={idx}>
                                        <td className="border p-2">{idx + 1}</td>
                                        <td className="border p-2">{r.name}</td>
                                        <td className="border p-2 text-green-700">₹{r.sale}</td>
                                        <td className="border p-2 text-yellow-700">₹{r.paytm}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <p className="mt-4 font-semibold text-gray-900 text-center">
                            Total Sale: ₹{selected.totalSale} | Total Paytm: ₹{selected.totalPaytm}
                        </p>
                    </div>
                </div>
            )}



        </div>
    );
};

export default SalePaytm;
