import React, { useState, useEffect } from "react";
import axiosInstance from '../Dashboard/axiosInstance';
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import { 
  FaCloudUploadAlt, 
  FaFileExcel, 
  FaTrash, 
  FaDownload, 
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner
} from "react-icons/fa";

function UploadExcel() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [savedFiles, setSavedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // --- HANDLERS ---
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMessage(""); // Clear previous messages
    }
  };

  const handleSaveToDB = async () => {
    if (!selectedFile) {
      setMessage("❌ Please select a file");
      clearMessageAfterDelay();
      return;
    }

    setIsUploading(true);
    setMessage("⏳ Uploading file...");

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await axiosInstance.post("/exceluploader", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(`✅ ${response.data.message}`);
      toast.success("File uploaded successfully!");
      setSelectedFile(null);
      
      // Reset file input manually if needed
      document.getElementById('file-upload').value = "";
      
      fetchSavedFiles();
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setMessage("❌ Error saving file");
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
      clearMessageAfterDelay();
    }
  };

  const clearMessageAfterDelay = () => {
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchSavedFiles = async () => {
    try {
      const response = await axiosInstance.get("/exceluploader");
      setSavedFiles(response.data);
    } catch (error) {
      toast.warn("Error fetching files"); 
      // Commented out to prevent spamming on interval
    }
  };

  useEffect(() => {
    fetchSavedFiles();
    const interval = setInterval(fetchSavedFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (filename) => {
    try {
      const encodedFilename = encodeURIComponent(filename);
      const response = await axiosInstance.get(
        `/exceluploader/${encodedFilename}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const handleDelete = async (filename) => {
    if(!window.confirm("Are you sure you want to delete this file?")) return;
    
    try {
      const encodedFilename = encodeURIComponent(filename);
      await axiosInstance.delete(`/exceluploader/${encodedFilename}`);
      toast.success("File deleted successfully");
      fetchSavedFiles();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* --- Header --- */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
            >
                <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold text-gray-800">File Manager</h1>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* --- Upload Section --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Excel Sheet</h2>
            <p className="text-gray-500 mb-6 text-sm">Supported formats: .xlsx, .xls</p>

            <label 
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 group
                ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
            >
                <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={handleFileChange}
                />
                
                {selectedFile ? (
                    <div className="animate-fade-in">
                        <FaFileExcel className="text-5xl text-green-600 mb-3 mx-auto" />
                        <span className="text-green-800 font-semibold text-lg block">{selectedFile.name}</span>
                        <span className="text-green-600 text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                    </div>
                ) : (
                    <div className="group-hover:-translate-y-1 transition-transform duration-300">
                        <FaCloudUploadAlt className="text-5xl text-gray-400 group-hover:text-blue-500 mb-3 mx-auto transition-colors" />
                        <span className="text-gray-600 font-medium group-hover:text-blue-600">Click to browse or drag file here</span>
                    </div>
                )}
            </label>

            <button
                onClick={handleSaveToDB}
                disabled={!selectedFile || isUploading}
                className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2
                ${!selectedFile || isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
                {isUploading ? (
                    <><FaSpinner className="animate-spin" /> Uploading...</>
                ) : (
                    <>Save to Database</>
                )}
            </button>

            {/* Local Message Feedback */}
            {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2
                    ${message.includes("✅") ? "bg-green-100 text-green-700" : 
                      message.includes("⏳") ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                    {message.includes("✅") && <FaCheckCircle />}
                    {message.includes("❌") && <FaExclamationCircle />}
                    {message}
                </div>
            )}
        </div>

        {/* --- Saved Files Grid --- */}
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
               📂 Uploaded Files <span className="text-sm font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{savedFiles.length}</span>
            </h3>

            {savedFiles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400">No files uploaded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {savedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col relative group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                                    <FaFileExcel size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
                                    XLSX
                                </span>
                            </div>

                            <h4 className="text-gray-800 font-semibold text-sm truncate mb-1" title={file.filename}>
                                {file.filename}
                            </h4>
                            
                            <div className="text-xs text-gray-500 mb-4 flex flex-col gap-0.5">
                                <span>Size: {(file.chunkSize / 1024).toFixed(2)} KB</span>
                                <span>Date: {new Date(file.uploadDate).toLocaleDateString("en-GB")}</span>
                            </div>

                            <div className="mt-auto flex gap-2 pt-3 border-t border-gray-50">
                                <button
                                    onClick={() => handleDownload(file.filename)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
                                    title="Download"
                                >
                                    <FaDownload /> Download
                                </button>
                                <button
                                    onClick={() => handleDelete(file.filename)}
                                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-colors"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default UploadExcel;