import React, { useState, useEffect } from "react";
import axios from "axios";

const ExcelUploader = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle File Upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    setIsLoading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:5000/upload", formData);
      alert("File uploaded successfully!");
      fetchData(); // Refresh Data
    } catch (error) {
      setUploadError("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Data from Backend
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/data");
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // Download Excel
  const downloadExcel = () => {
    window.location.href = "http://localhost:5000/download";
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Excel Upload & Display</h2>
      <form onSubmit={uploadFile}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload"}
        </button>
        {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
      </form>

      <button onClick={downloadExcel}>Download Excel</button>

      <h3>Excel Data</h3>
      {data.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default ExcelUploader;