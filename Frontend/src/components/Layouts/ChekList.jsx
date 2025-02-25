import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const responses = await Promise.all(
          sections.map((section) => axios.get(`http://localhost:5500/mastersheet/${section.route}`, { headers }))
        );
        
        const newData = sections.reduce((acc, section, index) => {
          acc[section.key] = responses[index].data;
          return acc;
        }, {});

        setData(newData);
      } catch (err) {
        alert("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">MASTER SHEET</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(({ key, title, route }) => (
          <div key={key} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">{title}</h2>
            <div className="flex flex-col items-center">
              <Link
                to={`/mastersheet/${route}`}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition w-full text-center"
              >
                Create
              </Link>
            </div>
            <div className="grid mt-4 grid-cols-1 gap-4">
              {data[key]?.map((item) => (
                <Link
                  to={`/mastersheet/${route}/${item._id}`}
                  key={item._id}
                  className="p-4 bg-gray-100 border rounded-lg shadow-md hover:bg-gray-200 transition text-center"
                >
                  <p className="font-bold">Update Report</p>
                  <span className="text-gray-700 text-sm">
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "2-digit", year: "numeric"
                    })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="text-xl" /> <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default ChekList;