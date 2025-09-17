import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../Dashboard/axiosInstance";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const sections = [
  { key: "pumpSheetData", title: "Pump Report Sheet", route: "pumpsheet" },
  { key: "salesmangemnt", title: "Sales Management Sheet", route: "salesmanagementsheet" },
  { key: "purchasemangemnt", title: "Purchase Management", route: "purchasemanagement" },
  { key: "lubricantmangemnt", title: "Lubricant Management", route: "lubricantmanagement" },
  { key: "tanklorry", title: "Tank Lorry Management", route: "tanklorry" },
  { key: "bpclstatutory", title: "BPCL & Statutory Management", route: "bpcl&statutory" },
  { key: "stafff", title: "Staff Management", route: "staffmanagement" },
  { key: "finn", title: "Finance Management", route: "finance" },
];

const ChekList = () => {
  const [data, setData] = useState({});
  const [visibleCounts, setVisibleCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          toast.warn("No valid session found. Please log in.");
          return;
        }
        const responses = await Promise.all(
          sections.map((section) => axiosInstance.get(`/mastersheet/${section.route}`))
        );

        const newData = sections.reduce((acc, section, index) => {
          acc[section.key] = responses[index].data;
          return acc;
        }, {});

        setData(newData);

        const initialCounts = sections.reduce((acc, section) => {
          acc[section.key] = 6;
          return acc;
        }, {});
        setVisibleCounts(initialCounts);
      } catch (err) {
        toast.warn("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const loadMore = (key) => {
    setVisibleCounts((prev) => ({ ...prev, [key]: prev[key] + 6 }));
  };

  return (
    <>
      {/* 🔹 Floating Notice Bar (Visible only on Mobile/Tablet) */}
      <div className="sticky top-0 z-50 bg-yellow-100 border-b border-yellow-300 text-yellow-800 px-4 py-2 flex items-center justify-center gap-2 shadow-md text-sm md:hidden">
        <FaInfoCircle className="text-yellow-600" />
        <p className="font-medium text-center">
          📢 Please switch to <span className="font-bold">Desktop Mode</span> for the best experience.
        </p>
      </div>


      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-800 mb-4">
          MASTER SHEET
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(({ key, title, route }) => (
            <div
              key={key}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-center text-blue-600 font-serif mb-4">
                {title}
              </h2>
              <div className="flex flex-col items-center">
                <Link
                  to={`/mastersheet/${route}`}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition w-full text-center"
                >
                  Create
                </Link>
              </div>

              <div className="grid mt-4 grid-cols-2 md:grid-cols-3 gap-3">
                {data[key]?.slice(0, visibleCounts[key]).map((item) => (
                  <Link
                    to={`/mastersheet/${route}/${item._id}`}
                    key={item._id}
                    className="p-3 bg-gray-100 border rounded-md shadow-sm hover:bg-gray-200 transition text-center text-xs"
                  >
                    <p className="font-bold text-sm">Update</p>
                    <span className="text-gray-600">
                      {new Date(item.dat2 || item.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </Link>
                ))}
              </div>

              {data[key]?.length > visibleCounts[key] && (
                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => loadMore(key)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-xs"
                  >
                    See More
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back to Dashboard */}
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
    </>
  );
};

export default ChekList;
