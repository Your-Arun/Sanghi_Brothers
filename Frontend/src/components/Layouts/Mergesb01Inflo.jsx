import axiosInstance from '../Dashboard/axiosInstance';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from 'react-toastify';

const MergeSBInflo = () => {
  const [sbiUpdate, setSbiUpdate] = useState([]);
  const [inOutFlow, setInOutFlow] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          toast.warn("No valid session found. Please log in.");
          return;
        }

        const [sbiResponse, flowResponse] = await Promise.all([
          axiosInstance.get("/fundposition"),
          axiosInstance.get("/bank/monthlyflow")
        ]);

        setSbiUpdate(sbiResponse.data);
        setInOutFlow(flowResponse.data);
      } catch (error) {
        toast.warn("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6         flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">
        🏦 Bank Related Reports
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-xl">

        {/* SB Bank Report */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">📘 SB Bank Report</h2>
          <Link
            to="/fundposition"
            className="block mb-6 w-full bg-blue-500 hover:bg-blue-600 text-white text-center font-medium py-2.5 rounded-md transition"
          >
            + Fund Position
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sbiUpdate.length > 0 ? (
              sbiUpdate.map((item) => (
                <Link
                  to={`/fundposition/${item._id}`}
                  key={item._id}
                  className="bg-gray-50 hover:bg-blue-100 p-4 rounded-md border border-gray-200 shadow-sm text-center transition-all duration-200"
                >
                  <div className="font-semibold text-gray-800">{item.username}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(item.inputs.date1).toLocaleDateString("en-GB")}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No SB Updates Found</p>
            )}
          </div>
        </div>

        {/* In-Out Flow */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-green-600 mb-4 text-center">💰 In-Out Flow</h2>
          <Link
            to="/bank/monthlyflow"
            className="block mb-6 w-full bg-green-500 hover:bg-green-600 text-white text-center font-medium py-2.5 rounded-md transition"
          >
            + In-Out Flow
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inOutFlow.length > 0 ? (
              inOutFlow.map((flow) => (
                <div
                  key={flow._id}
                  onClick={() => navigate(`/bank/monthlyflow/${flow._id}`)}
                  className="bg-gray-50 hover:bg-green-100 p-4 rounded-md border border-gray-200 shadow-sm text-center transition cursor-pointer"
                >
                  <div className="font-semibold text-gray-800">{flow.User}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(flow.inputs.date1).toLocaleDateString("en-GB")}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No In-Out Flow Records</p>
            )}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-md flex justify-center">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <FaArrowLeft className="text-lg" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default MergeSBInflo;
