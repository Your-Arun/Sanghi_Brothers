import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalePaytm = () => {
    const [rows, setRows] = useState(Array(6).fill({ name: "", sale: "", paytm: "" }));
    const [date, setDate] = useState("");
    const [shift, setShift] = useState("Morning");
    const [entries, setEntries] = useState([]);


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
            <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-700">📦 Back Entries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {entries.map((entry) => (
                    <div
                        key={entry._id}
                        className="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-gray-500">
                                {new Date(entry.date).toLocaleDateString()} | <b>{entry.shift}</b>
                            </p>
                        </div>

                        {/* Same format as saved table */}
                        <table className="w-full text-sm border">
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
                                    <tr key={idx} className="odd:bg-white even:bg-gray-50">
                                        <td className="border px-2 py-1">{idx + 1}</td>
                                        <td className="border px-2 py-1">{r.name || "—"}</td>
                                        <td className="border px-2 py-1">{r.sale || 0}</td>
                                        <td className="border px-2 py-1">{r.paytm || 0}</td>
                                    </tr>
                                ))}
                                <tr className="bg-yellow-50 font-bold">
                                    <td className="border px-2 py-1" colSpan={2}>Total</td>
                                    <td className="border px-2 py-1">{entry.totalSale}</td>
                                    <td className="border px-2 py-1">{entry.totalPaytm}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalePaytm;
