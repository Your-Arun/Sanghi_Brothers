import React from "react";

const AttendanceTablePage = ({ users }) => {
  return (
    <div className="mt-6 bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-100 text-blue-700">
          <tr>
            <th className="px-4 py-2">Employee</th>
            <th className="px-4 py-2">Designation</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Check-in</th>
            <th className="px-4 py-2">Checkout</th>
            <th className="px-4 py-2 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {users?.flatMap((user) =>
            (user.attendance || []).map((att, idx) => (
              <tr key={idx} className="border-b hover:bg-blue-50">
                <td className="px-4 py-2 flex items-center gap-2">
                  <img src={user.photo || ""} className="w-8 h-8 rounded-full" />
                  {user.name}
                </td>
                <td className="px-4 py-2">{user.designation}</td>
                <td className="px-4 py-2">{att.date || "--"}</td>
                <td className="px-4 py-2">{att.checkIn || "--"}</td>
                <td className="px-4 py-2">{att.checkOut || "--"}</td>
                <td className="px-4 py-2 text-center">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTablePage;
