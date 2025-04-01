import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import previousImage from "/previous.png";

const ChekList = () => {
    const [pumpSheetData, setPumpSheetData] = useState([]);

    useEffect(() => {
        const fetchPumpSheetData = async () => {
            try {
                const response = await axiosInstance.get("/newlekhajokha", {
                });
                setPumpSheetData(response.data);
            } catch (error) {
                console.error("Error fetching pump sheet data:", error);
            }
        };
        fetchPumpSheetData();
    }, []);

    return (
        <div className="h-[90vh] flex flex-col items-center bg-gray-50 p-6">
            {/* Page Title */}
            <h1 className="text-4xl font-bold text-blue-600 mb-6">LEKHA JOKHA</h1>

            {/* Create Button */}
            <div className="w-full max-w-lg">
                <Link
                    to="/newlekhajokha"
                    className="block p-6 bg-blue-500 text-white font-bold rounded-lg shadow-lg text-center transition hover:bg-blue-600"
                >
                    Create New Report
                </Link>
            </div>

            {/* Reports Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                {pumpSheetData.map((pump) => (
                    <Link
                        key={pump._id}
                        to={`/newlekhajokha/${pump._id}`}
                        className="p-4 bg-gray-200 rounded-lg shadow-md text-center hover:bg-gray-300 transition"
                    >
                        <h4 className="text-lg font-semibold">Updated Report</h4>
                        <p className="text-blue-700 font-bold">
                            {new Date(pump.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Back Button */}
            <div className="fixed bottom-6 left-6">
                <Link to="/dashboard">
                    <img src={previousImage} alt="Back" width={50} className="rounded-full shadow-md" />
                </Link>
            </div>
        </div>
    );
};

export default ChekList;
