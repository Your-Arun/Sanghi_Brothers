import axiosInstance from '../Dashboard/axiosInstance'
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Using React Icons
import { toast } from 'react-toastify'

const MergeSBInflo = () => {
  const [sbiUpdate, setSbiUpdate] = useState([]);
  const [inOutFlow, setInOutFlow] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("authToken"); // ✅ Use sessionStorage
        if (!token) {
          toast.warn("No valid session found. Please log in.");
          return;
        }
        // Fetch Fund Position Data
        const sbiResponse = await axiosInstance.get("/fundposition", {
        });
        setSbiUpdate(sbiResponse.data);
        // Fetch Monthly Flow Data
        const flowResponse = await axiosInstance.get("/bank/monthlyflow", {
        });
        setInOutFlow(flowResponse.data);
      } catch (error) {
        toast.warn("Failed to fetch data. Please try again.");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col bg-gradient-to-r from-blue-400 to-yellow-400 items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* SB Bank Report Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
            🏦 SB Bank Report
          </h2>
          <div className="flex flex-col items-center">
            <Link
              to="/fundposition"
              className="p-4 border bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-center w-full"
            >
              <h3 className="text-xl font-bold">Fund Position</h3>
            </Link>

            <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-center">
              {sbiUpdate.length > 0 ? (
                sbiUpdate.map((sbii) => (
                  <Link
                    to={`/fundposition/${sbii._id}`}
                    key={sbii._id}
                    className="p-4 border bg-gray-200 text-xl rounded-lg shadow-md hover:bg-blue-200 transition duration-300 hover:scale-105 text-center"
                  >
                    <h1 className="text-2xl text-gray-800 font-semibold">{sbii.username}</h1>
                    <h3 className="text-lg font-medium text-gray-700">
                      {new Date(sbii.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h3>
                  </Link>
                ))
              ) : (
                <div className="p-4 border bg-gray-200 rounded-lg shadow-md text-center">
                  No SB Updates
                </div>
              )}
            </div>
          </div>
        </div>

        {/* In-Out Flow Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
            💰 In-Out Flow
          </h2>
          <div className="flex flex-col items-center">
            <Link
              to="/bank/monthlyflow"
              className="p-4 border bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 text-center w-full"
            >
              <h3 className="text-xl font-bold">In-Out Flow</h3>
            </Link>

            <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-center">
              {inOutFlow.length > 0 ? (
                inOutFlow.map((flow) => (
                  <div
                    onClick={() => navigate(`/bank/monthlyflow/${flow._id}`)}
                    key={flow._id}
                    className="p-4 border bg-gray-200 rounded-lg shadow-md hover:bg-green-200 transition duration-300 hover:scale-105 cursor-pointer text-center"
                  >
                    <h1 className="text-2xl text-gray-800 font-semibold">{flow.User}</h1>
                    <h3 className="text-lg font-medium text-gray-700">
                      {new Date(flow.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h3>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 font-bold text-center">Not available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white rounded-t-lg shadow-md flex justify-center">
        <Link to="/bankreport" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
          <FaArrowLeft className="text-2xl" />
          <span className="text-lg font-semibold">Back</span>
        </Link>
      </div>
    </div>
  );
};

export default MergeSBInflo;