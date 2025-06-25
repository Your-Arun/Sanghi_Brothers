import React, { useState, useEffect } from "react";
import axiosInstance from '../Dashboard/axiosInstance'
import { useNavigate } from "react-router-dom"; // 👈 Navigation ke liye import
import { toast } from "react-toastify";

const AllShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const navigate = useNavigate(); // 👈 Navigation function

  useEffect(() => {
    fetchAllShifts();
  }, []);

  const fetchAllShifts = async () => {
    try {
      const response = await axiosInstance.get("/allshifts");
      if (response.data.success && Array.isArray(response.data.shifts)) {
        const sortedShifts = response.data.shifts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setShifts(sortedShifts);
        setFilteredShifts(sortedShifts);
      } else {
        setShifts([]);
        setFilteredShifts([]);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setShifts([]);
      setFilteredShifts([]);
    }
  };
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
        const response = await axiosInstance.delete(`/shift/${id}`);
        if (response.data.success) {
          setShifts((prevShifts) => prevShifts.filter((shift) => shift._id !== id));
          setFilteredShifts((prevShifts) => prevShifts.filter((shift) => shift._id !== id));
        }
      } catch (error) {
        console.error("Error deleting shift:", error);
      }
    })
  }

  const handleFilterChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);

    if (date === "") {
      setFilteredShifts(shifts);
    } else {
      setFilteredShifts(shifts.filter((shift) => shift.date === date));
    }
  };

  return (
    <div className="container mx-auto p-5">
      {/* Back Button */}
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-700 transition"
        onClick={() => navigate(-1)} // 👈 Pichhle page pe jaane ka function
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-4">All Shifts</h2>

      {/* Date Filter */}
      <div className="mb-4 text-center">
        <input
          type="date"
          className="p-2 border rounded"
          value={selectedDate}
          onChange={handleFilterChange}
        />
      </div>

      {filteredShifts.length === 0 ? (
        <p className="text-center text-gray-500">No shifts available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredShifts.map((shift) => (
            <div key={shift._id} className="bg-white shadow-md p-5 rounded-lg relative">
              <button
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-xs"
                onClick={() => handleDelete(shift._id)}
              >
                Delete
              </button>

              <h3 className="text-xl font-bold text-center">{shift.shiftType}</h3>
              <p className="text-center text-gray-600">{shift.date}</p>
              <p className="text-center font-medium text-indigo-600">
                {shift.startTime} - {shift.endTime}
              </p>

              <div className="flex justify-evenly mt-3">
                <p className="font-semibold">Supervisor: <span className="text-red-800">{shift.supervisor}</span></p>
                <p className="font-semibold">Extra Operator: <span className="text-red-800">{shift.extraOperator}</span></p>
                <p className="font-semibold">Air Boy: <span className="text-red-800">{shift.airBoy}</span></p>
              </div>

              <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px] table-fixed border border-gray-300 text-sm rounded-lg">
                     <thead>
                    <tr className="bg-gray-200 text-gray-800">
                      <th className="py-2 px-3 border">Nozzle</th>
                      <th className="py-2 px-3 border">Member</th>
                      <th className="py-2 px-3 border">Overtime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shift.nozzles.map((nozzle, index) => (
                      <tr key={index} className="hover:bg-gray-100 transition">
                        <td className="py-2 px-3 border text-center">{nozzle.nozzleNumber}</td>
                        <td className="py-2 px-3 border text-center">{nozzle.member}</td>
                        <td className="py-2 px-3 border text-center">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-bold ${nozzle.overtime ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                          >
                            {nozzle.overtime ? "Overtime ✅" : "❌ Overtime"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllShifts;