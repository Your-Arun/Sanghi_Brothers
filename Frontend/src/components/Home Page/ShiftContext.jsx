const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ShiftRow = ({ nozzle, member, isOvertime }) => (
  <tr className="hover:bg-gray-100 transition">
    <td className="py-2 px-3 border text-center">{nozzle}</td>
    <td className="py-2 px-3 border text-center">
      {member?.name || <span className="text-gray-400 italic">Unassigned</span>}
    </td>
    <td className="py-2 px-3 border text-center">
      <span
        className={`px-2 py-1 rounded-lg text-xs font-bold ${
          isOvertime ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {isOvertime ? "Overtime ✅" : "❌ Overtime"}
      </span>
    </td>
  </tr>
);

const ShiftList = ({ date, shifts, morningOvertimeMembers, eveningOvertimeMembers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-5 mb-4">
      {shifts.map((shift) => {
        const nozzles = shift.nozzles || [1, 2, 3, 4, 5, 6]; // Nozzles sequence fix
        const shuffledMembers = shuffleArray(shift.members || []);

        return (
          <div
            key={shift.id}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
          >
            <h3 className="text-3xl font-bold text-gray-800 text-center">{shift.name}</h3>
            <p className="text-lg text-gray-600 text-center mt-1">
              📅 {date || "Not Assigned"}
            </p>
            <p className="text-lg font-medium text-center text-indigo-600 mt-1">
              ⏰ {shift.startTime} A.M - {shift.endTime} P.M
            </p>

            <div className="flex justify-between items-center bg-gray-100 p-3 mt-3 rounded-lg">
              {shift?.supervisor && (
                <span className="font-semibold text-gray-700 mr-10">
                  👨‍💼 Supervisor:{" "}
                  <span className="text-blue-600">{shift.supervisor.name.toUpperCase()}</span>
                </span>
              )}
              {shift?.airBoy && (
                <span className="font-semibold text-gray-700">
                  Air Boy: <span className="text-green-600">{shift.airBoy.name.toUpperCase()}</span>
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                    <th scope="col" className="py-2 px-3 border">Nozzle</th>
                    <th scope="col" className="py-2 px-3 border">Member</th>
                    <th scope="col" className="py-2 px-3 border">Overtime</th>
                  </tr>
                </thead>
                <tbody>
                  {nozzles.map((nozzle, index) => {
                    const member = shuffledMembers[index] || null;
                    const isOvertime =
                      member &&
                      ((shift.name === "Morning Shift" && morningOvertimeMembers.includes(member._id)) ||
                        (shift.name === "Evening Shift" && eveningOvertimeMembers.includes(member._id)));

                    return <ShiftRow key={index} nozzle={nozzle} member={member} isOvertime={isOvertime} />;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShiftList;
