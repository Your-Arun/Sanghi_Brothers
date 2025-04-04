import React, { useState } from "react";
import axiosInstance from '../Dashboard/axiosInstance'

function UploadExcel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedData, setUploadedData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Preview Excel file data
  const handlePreview = async () => {
    if (!selectedFile) {
      setMessage("❌ Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await axiosInstance.post("/api/preview", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedData(response.data.data || []);
      setMessage("✅ Preview loaded successfully!");
    } catch (error) {
      console.error("Error previewing file:", error);
      setMessage("❌ Error previewing file");
    }
  };

  // Save file to database
  const handleSave = async () => {
    if (!selectedFile) {
      setMessage("❌ Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await axiosInstance.post("/api/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`✅ ${response.data.message || "File saved successfully!"}`);
    } catch (error) {
      console.error("Error saving file:", error);
      setMessage("❌ Error saving file");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Upload Excel File</h2>

        <label className="w-full border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:border-blue-400 transition">
          <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} />
          {selectedFile ? (
            <span className="text-gray-700 font-medium">{selectedFile.name}</span>
          ) : (
            <span className="text-gray-500">Click to select a file</span>
          )}
        </label>

        <div className="flex gap-2 mt-4">
          <button onClick={handlePreview} className="bg-yellow-500 text-white px-4 py-2 rounded-lg w-full hover:bg-yellow-600 transition">
            Preview
          </button>
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600 transition">
            Save
          </button>
        </div>

        {message && (
          <p className={`mt-3 text-center text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>

      {/* Show extracted Excel data in a table */}
      {uploadedData.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Uploaded Data</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  {Object.keys(uploadedData[0]).map((key) => (
                    <th key={key} className="border border-gray-300 px-3 py-2 text-left">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uploadedData.map((row, index) => (
                  <tr key={index} className="border border-gray-300">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="border border-gray-300 px-3 py-2">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadExcel;