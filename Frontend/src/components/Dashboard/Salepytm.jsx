import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalePaytm = () => {
    const [rows, setRows] = useState(
        Array(6).fill({ name: "", sale: "", paytm: "" })
    );
    const [date, setDate] = useState("");
    const [shift, setShift] = useState("Morning"); // ✅ New Shift field
    const [entries, setEntries] = useState([]);
    const [filterDate, setFilterDate] = useState("");
    const [totals, setTotals] = useState({ sale: 0, paytm: 0 });
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);

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
        if (!date) return toast.error("⚠️ Date required!");
        try {
            await axiosInstance.post("/salepaytm", { date, shift, rows });
            setRows(Array(6).fill({ name: "", sale: "", paytm: "" })); // reset
            toast.success("✅ Data saved successfully!");
            fetchEntries();
        } catch (err) {
            toast.error("❌ Error saving data");
        }
    };

    // Fetch data
    const fetchEntries = async () => {
        try {
            setLoading(true);
            setNoData(false);

            const res = await axiosInstance.get("/salepaytm", {
                params: filterDate ? { date: filterDate } : {},
            });

            if (res.data.length === 0) {
                setEntries([]);
                setTotals({ sale: 0, paytm: 0 });
                setNoData(true); // ⚠️ show no data message
            } else {
                setEntries(res.data);

                // Calculate totals
                let sale = 0,
                    paytm = 0;
                res.data.forEach((e) => {
                    sale += e.totalSale;
                    paytm += e.totalPaytm;
                });
                setTotals({ sale, paytm });
            }
        } catch (err) {
            toast.error("❌ Error fetching data");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchEntries();
    }, [filterDate]);

    // Delete entry
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/salepaytm/${id}`);
            toast.info("🗑 Entry deleted");
            fetchEntries();
        } catch (err) {
            toast.error("❌ Error deleting entry");
        }
    };


    {/* Cards */ }
    {
        loading ? (
            <div className="text-center text-gray-500 mt-6 font-semibold">
                ⏳ Loading...
            </div>
        ) : noData ? (
            <div className="text-center text-gray-500 mt-6 font-semibold">
                ❌ No records found
            </div>
        ) : (
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

                        {/* Totals */}
                        <div className="mt-3 font-bold text-sm flex justify-between">
                            <span>Total Sale: {entry.totalSale}</span>
                            <span>Total Paytm: {entry.totalPaytm}</span>
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
        )
    }

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
                            Date: {new Date(entry.date).toLocaleDateString()} | Shift:{" "}
                            <b>{entry.shift}</b>
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

                        {/* Totals */}
                        <div className="mt-3 font-bold text-sm flex justify-between">
                            <span>Total Sale: {entry.totalSale}</span>
                            <span>Total Paytm: {entry.totalPaytm}</span>
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

            {/* Overall Totals when filter applied */}
            {filterDate && (
                <div className="mt-6 p-4 bg-yellow-100 border rounded text-center font-bold">
                    Date {new Date(filterDate).toLocaleDateString()} Summary → Total Sale:{" "}
                    {totals.sale} | Total Paytm: {totals.paytm}
                </div>
            )}
        </div>
    );
};

export default SalePaytm;
