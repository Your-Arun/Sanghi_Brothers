import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import previousImage from "/public/previous.png";
import saveImage from "/public/save.png";
import binImage from "/public/bin.png";

const Mergesb01Inflo = () => {
  const [sbiupdate, setSbiUpdate] = useState([]);
  const [inoutflow, setInOutFlow] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const sbiupdate = await axios.get("http://localhost:5500/fundposition", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSbiUpdate(sbiupdate.data);
      const flowww = await axios.get("http://localhost:5500/bank/monthlyflow", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInOutFlow(flowww.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-6 bg-gray-100 justify-center ">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
            SB Bank Report
          </h2>
          <div className="flex flex-col items-center">
            <Link
              to="/fundposition"
              className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
            >
              <h3 className="text-xl font-bold text-white ">SB</h3>
            </Link>

            <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-center">
              {sbiupdate.length > 0 ? (
                sbiupdate.map((sbii) => (
                  <Link
                    to={`/fundposition/${sbii._id}`}
                    key={sbii._id}
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 mb-2 w-full text-center"
                  >
                    {sbii.username}
                  </Link>
                ))
              ) : (
                <div className="p-4 border bg-slate-300 rounded-lg shadow-md text-center">
                  Not SB Update
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
            In-Out Flow
          </h2>
          <div className="flex flex-col items-center">
            <Link
              to="/bank/monthlyflow"
              className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
            >
              <h3 className="text-xl font-bold text-white">In-Out Flow</h3>
            </Link>

            <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-center">
              {inoutflow.length > 0 ? (
                inoutflow.map((flo) => (
                  <div
                    onClick={() => {
                      navigate(`/bank/monthlyflow/${flo._id}`);
                    }}
                    key={flo._id} // Ensure you use a unique identifier
                    className="p-4 border hover:cursor-pointer bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 mb-2 w-full text-center"
                  >
                    <h1 className="text-2xl text-brown-600">{flo.User}</h1>
                    <h3 className="font-xl text-lg font-serif text-gray-700">
                      {flo.Department}
                    </h3>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 font-bold text-center">
                  Not available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4  rounded-t-lg shadow-md">
  <div className="flex justify-evenly">
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

export default Mergesb01Inflo;
