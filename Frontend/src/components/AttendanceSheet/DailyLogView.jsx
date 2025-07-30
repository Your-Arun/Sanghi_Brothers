import React from "react";
import DatePicker from "react-datepicker"; // or use simple <input type="date" />
import "react-datepicker/dist/react-datepicker.css";

const DailyLogView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyLog, setDailyLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDailyLog = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const res = await axiosInstance.get(`/users/daily-attendance?date=${dateStr}`);
      setDailyLog(res.data);
    } catch (err) {
      console.error("Failed to fetch daily log:", err);
    }
    setLoading(false);
  };

  const filteredLog = dailyLog.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">📋 Daily Attendance Log</h2>

      <div className="flex gap-4 items-center mb-4 flex-wrap">
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="bg-gray-700 px-4 py-2 rounded"
        />
        <button
          onClick={fetchDailyLog}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          🔍 View Log
        </button>
        <input
          type="text"
          placeholder="Search user..."
          className="bg-gray-700 px-4 py-2 rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filteredLog.length === 0 ? (
        <p className="text-red-400">No users found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLog.map((user) => (
            <div
              key={user._id}
              className={`p-4 rounded-lg shadow bg-gray-900 flex items-center gap-4 ${
                user.status === "Present" ? "border-green-500 border" : "border-red-500 border"
              }`}
            >
              <img
                src={user.photo || ""}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.designation}</p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      user.status === "Present" ? "text-green-400" : "text-red-400"
                    }
                  >
                    {user.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default DailyLogView;
