import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import previousImage from "/public/previous.png";
import axios from "axios";

const ChekList = () => {
    const [pumpSheetData, setPumpSheetData] = useState([]);

    useEffect(() => {
        const fetchPumpSheetData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:5500/meterclose",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setPumpSheetData(response.data);
            } catch (error) {
                console.error("Error fetching pump sheet data:", error);
            }
        };
        fetchPumpSheetData();
    }, []);

    return (
        <>
            <div className="container h-[80%]">
                <h1 className="text-4xl mt-[-30px] ">METER CLOSE</h1>
                <div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-6 bg-gray-100 justify-center mt-[20px]">
                        <div className="mb-6">
                            <div className="flex flex-col items-center">
                                <Link
                                    to="/meterclose"
                                    className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
                                >
                                    <h3 className="text-xl font-bold text-white ">Create</h3>
                                </Link>
                            </div>
                            <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pumpSheetData.map((pump, index) => (
                                    <Link
                                        to={`/meterclose/${pump._id}`}
                                        key={pump._id} // Ensure you use a unique identifier
                                        className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                                    >
                                        <h4 className="text-lg font-bold">
                                            <p>Updated Report</p>
                                           <h2> {new Date(pump.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}</h2>
                                        </h4>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-evenly mb-[10px] mt-[calc-(container)]">
                    <Link to={"/dashboard"}>
                        <div>
                            <img src={previousImage} width={50} alt="Back" />
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ChekList;