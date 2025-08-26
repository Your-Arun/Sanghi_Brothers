import React, { useState, useEffect } from "react";
import axiosInstance from "../Axios/axiosInstance";
import { toast } from "react-toastify";

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [savedFiles, setSavedFiles] = useState([]);

  // ✅ Fetch Saved Files
  const fetchSavedFiles = async () => {
    try {
      const res = await axiosInstance.get("/exceluploader");
      setSavedFiles(res.data);
    } catch (error) {
      toast.error("❌ Failed to fetch files");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSavedFiles();
  }, []);

  // ✅ Handle File Change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ✅ Handle Upload
  const handleUpload = async () => {
    if (!file) {
      toast.warn("⚠️ Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const res = await axiosInstance.post("/exceluploader", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ File uploaded successfully");
      setFile(null);
      fetchSavedFiles();
    } catch (error) {
      toast.error("❌ Upload failed");
      console.error(error);
    }
  };

  // ✅ Handle Download
  const handleDownload = async (filename) => {
    try {
      const res = await axiosInstance.get(`/exceluploader/${filename}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      toast.success("📥 Download started");
    } catch (error) {
      toast.error("❌ Download failed");
      console.error(error);
    }
  };

  // ✅ Handle Delete with Toast Confirmation
  const handleDelete = (filename) => {
    toast.info(
      <div className="flex flex-col gap-2">
        <p>❓ Are you sure you want to delete <b>{filename}</b>?</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={async () => {
              try {
                const encodedFilename = encodeURIComponent(filename);
                await axiosInstance.delete(`/exceluploader/${encodedFilename}`);
                toast.dismiss();
                toast.success("🗑️ File deleted successfully");
                fetchSavedFiles();
              } catch (error) {
                toast.dismiss();
                toast.error("❌ Delete failed");
                console.error(error);
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">📊 Excel File Manager</h2>

      {/* Upload Section */}
      <div className="flex gap-2 mb-6">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload
        </button>
      </div>

      {/* Saved Files List */}
      <h3 className="text-xl font-semibold mb-2">📁 Saved Files</h3>
      {savedFiles.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {savedFiles.map((file, index) => (
            <li
              key={file._id || index}
              className="flex justify-between items-center py-2"
            >
              <span>{file.filename}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(file.filename)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file.filename)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadExcel;
