import React, { useEffect, useState } from "react";
import { Link,  useLocation } from "react-router-dom";
import axios from "axios";

const DepartmentReports = () => {
  const [reports, setReports] = useState([]);
  const [userName, setUserName] = useState(""); // State to hold user name
  const [reportfile, setreportfile] = useState(""); // State to hold user name
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const department = query.get("department");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5500/reports?department=${department}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        alert("Failed to fetch reports.");
      }
    };

    const Profile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5500/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(response.data.username); // Assuming the user's name is in the 'username' field
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Failed to fetch user profile.");
      }
    };

    const file = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5500/reportfile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setreportfile(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Report File.", error);
        alert("Failed to fetch Report File.");
      }
    };

    if (department) {
      fetchReports();
      Profile();
      file();
    }
  }, [department]);

  return (
    <>
      <div className="h-[90vh]">
        {userName && (
          <h2 className="text-4xl p-4 font-serif mb-2 text-center">
            Welcome, <span className="text-red-400 text-5xl">{userName} </span>!
          </h2>
        )}
        <h1 className="text-2xl font-serif mb-2 text-center">
          Reports for {department}
        </h1>
        <div>
          <div>
            <h2 className="text-3xl p-2 font-serif">Report File</h2>
            <div className="grid p-4 grid-cols-1 text-center gap-4 md:grid-cols-3">
              {reportfile.length > 0 ? (
                reportfile
                  .filter((repofile) => repofile.department === department) // Filter by department
                  .map((repofile) => (
                   <Link to={`/reportfile/${repofile._id}`}> 
                    <div
                   key={repofile._id}
                   
                   className="p-4 border bg-slate-400 rounded shadow hover:bg-blue-200 cursor-pointer"
                 >
                   <h2 className="font-bold">
                     {repofile.entryDate.split("T")[0]}
                   </h2>
                   <h2>
                     {" "}
                     Cash Sales{" "}
                     <span className="font-bold">
                       {repofile.reports.cashsales}
                     </span>
                   </h2>
                   <p>{repofile.content}</p>{" "}
                   {/* Adjust according to your data structure */}
                 </div>
                 </Link>
                  ))
              ) : (
                <p>No report files available.</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-3xl p-2 font-serif">Complaints</h2>
            <div className="grid p-4 grid-cols-1 text-center gap-4 md:grid-cols-3">
              {reports.length > 0 ? (
                reports
                  .filter((report) => report.department === department)
                  .map((report) => (
                    <div>
                      <div
                        className="p-4 border   bg-slate-400 rounded shadow hover:bg-blue-200 cursor-pointer"
                        key={report._id}
                      >
                        <h2>{report.title}</h2>
                        <p>{report.content}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <p>No reports available for this department.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
       <footer>
        <Link to={'/dashboard'}> <img className="w-[40px] mx-auto m-4" src="public/backarrow.png" alt="Back" /> </Link>
       </footer>
      </div>
    </>
  );
};

export default DepartmentReports;
