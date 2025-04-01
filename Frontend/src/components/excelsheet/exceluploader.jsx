import React, { useState, useEffect } from "react";
import axiosInstance from '../Dashboard/axiosInstance'
import BackButton from "../Home Page/backbutton";
import previousImage from "/previous.png"; // ✅ Fixed import

function UploadExcel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [savedFiles, setSavedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSaveToDB = async () => {
    if (!selectedFile) {
      setMessage("❌ Please select a file");
      clearMessageAfterDelay();
      return;
    }

    setMessage("⏳ Uploading file...");

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await axiosInstance.post("/exceluploader", formData, {
      });
      setMessage(`✅ ${response.data.message}`);
      setSelectedFile(null);
      fetchSavedFiles();
    } catch (error) {
      setMessage("❌ Error saving file");
    }

    clearMessageAfterDelay();
  };

  const clearMessageAfterDelay = () => {
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchSavedFiles = async () => {
    try {
      const response = await axiosInstance.get("/exceluploader", {
      });
      setSavedFiles(response.data);
    } catch (error) {
      alert("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchSavedFiles();
    const interval = setInterval(fetchSavedFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (filename) => {
    try {
      const encodedFilename = encodeURIComponent(filename); // ✅ Encode filename
      const response = await axiosInstance.get(`/exceluploader/${encodedFilename}`, {
        responseType: "blob",
        
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌ Download failed:", error);
    }
  };
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-5 text-center">📂 Upload Excel File</h2>

        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-blue-500">
          <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} />
          <div className="text-center">
            <span className="text-gray-600">
              {selectedFile ? selectedFile.name : "Click or Drag & Drop File Here"}
            </span>
          </div>
        </label>

        <button
          onClick={handleSaveToDB}
          className="mt-5 bg-green-500 text-white px-5 py-3 rounded-lg w-full hover:bg-green-600"
        >
          💾 Save to Database
        </button>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          📄 Saved Files
        </h3>

        {savedFiles.length === 0 ? (
          <p className="text-gray-500 text-center">No files available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center transition hover:scale-105 hover:shadow-lg"
              >
                <div className="text-4xl">📄</div>
                <p className="text-sm text-gray-700 font-medium mt-2 text-center">
                  {file.filename.length > 20 ? file.filename.slice(0, 20) + "..." : file.filename}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Size: {(file.chunkSize / 1024).toFixed(2)} KB
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded: {new Date(file.uploadDate).toLocaleDateString("en-GB")}
                </p>

                <button
                  onClick={() => handleDownload(file.filename)}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
                >
                  📥 Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="fixed bottom-6 left-6">
        <BackButton previousImage={previousImage} />
      </div>
    </div>
  );
}

export default UploadExcel;
