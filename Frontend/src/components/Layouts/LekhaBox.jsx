import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import previousImage from "/previous.png";
import { toast } from 'react-toastify'

const ChekList = () => {
    const [pumpSheetData, setPumpSheetData] = useState([]);

    useEffect(() => {
        const fetchPumpSheetData = async () => {
            try {
                const response = await axiosInstance.get("/newlekhajokha", {
                });
                setPumpSheetData(response.data);
            } catch (error) {
                toast.warn("Error fetching pump sheet data!");
            }
        };
        fetchPumpSheetData();
    }, []);
    const confirmDeleteToast = (onConfirm) => {
        toast(
          ({ closeToast }) => (
            <div className="flex flex-col gap-2">
              <p>Are you sure you want to delete this ?</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => {
                    onConfirm()
                    closeToast()
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Yes
                </button>
                <button
                  onClick={closeToast}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  No
                </button>
              </div>
            </div>
          ),
          {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
          }
        )
      }
    const handleDelete = async (id) => {
        confirmDeleteToast(async () => {
        try {
            await axiosInstance.delete(`/newlekhajokha/${id}`);
            toast.success("Report deleted successfully!");
            const updatedPumpSheetData = pumpSheetData.filter((pump) => pump._id !== id);
            setPumpSheetData(updatedPumpSheetData);
        } catch (error) {
            toast.warn("Error deleting report!");
        }
    })
  }

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-yellow-400  p-6">
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
                    <div key={pump._id} className="p-4 bg-gray-200 rounded-lg shadow-md text-center hover:bg-gray-300 transition">
                        <h4 className="text-lg font-semibold">Updated Report</h4>
                        <p className="text-blue-700 font-bold">
                            {new Date(pump.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </p>
                        <Link to={`/newlekhajokha/${pump._id}`}>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition">View</button>
                        </Link>
                        <button onClick={() => handleDelete(pump._id)} className="bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600 transition">Delete</button>
                    </div>
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