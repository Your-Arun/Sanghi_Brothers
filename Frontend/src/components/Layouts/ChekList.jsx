import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import previousImage from "/public/previous.png";
import axios from "axios";

const ChekList = () => {
  const [pumpSheetData, setPumpSheetData] = useState([]);
  const [salesmangemnt, setSalesmangemnt] = useState([]);
  const [purchasemangemnt, setPurchasemangemnt] = useState([]);
  const [lubricantmangemnt, setLubmangemnt] = useState([]);
  const[tanklorry,setTank]=useState([]);
  const[bpclstatutory,setBpclstatutory]=useState([]);
  const[stafff,setStaff]=useState([]);
  const[finn,setfin]=useState([]);

  useEffect(() => {
    const fetchPumpSheetData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5500/mastersheet/pumpsheet",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPumpSheetData(response.data);
        const response2 = await axios.get(
          "http://localhost:5500/mastersheet/salesmanagementsheet",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSalesmangemnt(response2.data);
        const response3 = await axios.get(
          "http://localhost:5500/mastersheet/purchasemanagement",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPurchasemangemnt(response3.data);
        const response4 = await axios.get(
          "http://localhost:5500/mastersheet/lubricantmanagement",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLubmangemnt(response4.data);
        const response5 = await axios.get(
          "http://localhost:5500/mastersheet/tanklorry",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTank(response5.data);
        const response6 = await axios.get(
          "http://localhost:5500/mastersheet/bpcl&statutory",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBpclstatutory(response6.data);
        const response7 = await axios.get(
          "http://localhost:5500/mastersheet/staffmanagement",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStaff(response7.data);
        const response8 = await axios.get(
          "http://localhost:5500/mastersheet/finance",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setfin(response8.data);
      } catch (err) {
        alert("fetch nhh hora");
      }
    };
    fetchPumpSheetData();
  }, []);
  return (
    <>
      <div className="container h-[80%]">
        <h1 className="text-4xl mt-[-30px] ">MASTER SHEET</h1>
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-6 bg-gray-100 justify-center mt-[20px]">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
                Pump Report Sheet
              </h2>
              <div className="flex flex-col items-center">
                <Link
                  to="/mastersheet/pumpsheet"
                  className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
                >
                  <h3 className="text-xl font-bold text-white ">Create</h3>
                </Link>
              </div>
              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pumpSheetData.map((pump) => (
                  <Link
                    to={`/mastersheet/pumpsheet/${pump._id}`}
                    key={pump._id} // Ensure you use a unique identifier
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                  >
                    <h4 className="text-lg font-bold">
                      <p>Update Report</p>
                      {new Date(pump.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              Sales Management Sheet
              </h2>
              <div className="flex flex-col items-center">
                <Link
                  to="/mastersheet/salesmanagementsheet"
                  className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
                >
                  <h3 className="text-xl font-bold text-white ">Create</h3>
                </Link>
              </div>
              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {salesmangemnt.map((sale) => (
                  <Link
                    to={`/mastersheet/salesmanagementsheet/${sale._id}`}
                    key={sale._id} // Ensure you use a unique identifier
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                  >
                    <h4 className="text-lg font-bold">
                      <p>Update Report</p>
                      {new Date(sale.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              Purchase Management 
              </h2>
              <div className="flex flex-col items-center">
                <Link
                  to="/mastersheet/purchasemanagement"
                  className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
                >
                  <h3 className="text-xl font-bold text-white ">Create</h3>
                </Link>
              </div>
              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {purchasemangemnt.map((sale) => (
                  <Link
                    to={`/mastersheet/purchasemanagement/${sale._id}`}
                    key={sale._id} // Ensure you use a unique identifier
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                  >
                    <h4 className="text-lg font-bold">
                      <p>Update Report</p>
                      {new Date(sale.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              Lubricant Management 
              </h2>
              <div className="flex flex-col items-center">
                <Link
                  to="/mastersheet/lubricantmanagement"
                  className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
                >
                  <h3 className="text-xl font-bold text-white ">Create</h3>
                </Link>
              </div>
              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lubricantmangemnt.map((sale) => (
                  <Link
                    to={`/mastersheet/lubricantmanagement/${sale._id}`}
                    key={sale._id} // Ensure you use a unique identifier
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                  >
                    <h4 className="text-lg font-bold">
                      <p>Update Report</p>
                      {new Date(sale.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              Tank Lorry Management 
              </h2>
              <div className="flex flex-col items-center">
                <Link
                  to="/mastersheet/tanklorry"
                  className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
                >
                  <h3 className="text-xl font-bold text-white ">Create</h3>
                </Link>
              </div>
              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tanklorry.map((sale) => (
                  <Link
                    to={`/mastersheet/tanklorry/${sale._id}`}
                    key={sale._id} // Ensure you use a unique identifier
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                  >
                    <h4 className="text-lg font-bold">
                      <p>Update Report</p>
                      {new Date(sale.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              BPCL & Statutory Management 
              </h2>
              <div className="flex flex-col items-center">
                <Link
                  to="/mastersheet/bpcl&statutory"
                  className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
                >
                  <h3 className="text-xl font-bold text-white ">Create</h3>
                </Link>
              </div>
              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bpclstatutory.map((sale) => (
                  <Link
                    to={`/mastersheet/bpcl&statutory/${sale._id}`}
                    key={sale._id} // Ensure you use a unique identifier
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                  >
                    <h4 className="text-lg font-bold">
                      <p>Update Report</p>
                      {new Date(sale.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              Staff Management 
              </h2>
              <div className="flex flex-col items-center">
                <Link
                  to="/mastersheet/staffmanagement"
                  className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
                >
                  <h3 className="text-xl font-bold text-white ">Create</h3>
                </Link>
              </div>
              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stafff.map((sale) => (
                  <Link
                    to={`/mastersheet/staffmanagement/${sale._id}`}
                    key={sale._id} // Ensure you use a unique identifier
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                  >
                    <h4 className="text-lg font-bold">
                      <p>Update Report</p>
                      {new Date(sale.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              Finance Management 
              </h2>
              <div className="flex flex-col items-center">
                <Link
                  to="/mastersheet/finance"
                  className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
                >
                  <h3 className="text-xl font-bold text-white ">Create</h3>
                </Link>
              </div>
              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {finn.map((sale) => (
                  <Link
                    to={`/mastersheet/finance/${sale._id}`}
                    key={sale._id} // Ensure you use a unique identifier
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                  >
                    <h4 className="text-lg font-bold">
                      <p>Update Report</p>
                      {new Date(sale.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
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
