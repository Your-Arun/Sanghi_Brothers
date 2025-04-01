import axiosInstance from '../axiosInstance'
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const MergingSBSection = () => {
    const [sb3update, setSb3Update] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("authToken"); // ✅ Use sessionStorage
                if (!token) {
                    alert("No valid token found. Please log in.");
                    return;
                }
                const sb3resp = await axiosInstance.get(
                    "/bank/monthlyfundflow",  
                );setSb3Update(sb3resp.data);
            } catch (err) {
                alert("Failed to fetch data.");
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="mb-10 p-6 rounded-lg shadow-md">
                <h1 className="text-center text-4xl p-4 mb-10">🏦 BANK RELATED REPORTS</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 p-6">
                    {/* SB Bank Report Section */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">🏦 SB Bank Report</h2>
                        <div className="flex flex-col items-center">
                            <Link
                                to="/sbbank"
                                className="p-6 border bg-green-200 rounded-lg shadow-md hover:bg-green-300 transition-all duration-300 text-center w-full transform hover:scale-105"
                            >
                                <h3 className="text-xl font-bold text-red-700">📊 Bank Report</h3>
                            </Link>
                        </div>
                    </div>

                    {/* Monthly Flow Section */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">🔄 Monthly Fund Flow</h2>
                        <div className="flex flex-col items-center">
                            <Link
                                to="/bank/monthlyfundflow/"
                                className="p-6 border bg-purple-200 rounded-lg shadow-md hover:bg-purple-300 transition-all duration-300 text-center w-full transform hover:scale-105"
                            >
                                <h3 className="text-xl font-bold text-pink-700">📅 Monthly Fund Flow</h3>
                            </Link>

                            {/* Fund Flow Links */}
                            <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {sb3update.length > 0 ? (
                                    sb3update.map((fund) => (
                                        <Link
                                            to={`/bank/monthlyfundflow/${fund._id}`}
                                            key={fund._id}
                                            className="p-4 border bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300 text-center cursor-pointer transform hover:scale-105"
                                        >
                                            <h4 className="text-lg font-bold text-gray-800">
                                                📆{" "}
                                                {new Date(fund.Date)
                                                    .toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })
                                                    .replace(/\//g, "/")}
                                            </h4>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center mt-2">No data available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SB Master CheckList */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">📋 SB Master CheckList</h2>
                        <div className="flex flex-col items-center">
                            <Link
                                to="/mastersheet"
                                className="p-6 border bg-green-200 rounded-lg shadow-md hover:bg-green-300 transition-all duration-300 text-center w-full transform hover:scale-105"
                            >
                                <h3 className="text-xl font-bold text-red-700">✅ Master CheckList</h3>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white rounded-t-lg shadow-md flex justify-center">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                    >
                        <FaArrowLeft className="text-2xl" />
                        <span className="text-lg font-semibold">Back</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default MergingSBSection;
