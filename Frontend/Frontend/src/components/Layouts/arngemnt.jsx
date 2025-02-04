import React, { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const ShiftManagementSystem = () => {
  const [members, setMembers] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [shiftPreferences, setShiftPreferences] = useState({});
  const [overtimeMembers, setOvertimeMembers] = useState([]);
  const [shifts, setShifts] = useState([
    {
      id: "1",
      name: "Morning Shift",
      startTime: "06:00",
      endTime: "14:30",
      members: [],
      nozzles: ["Nozzle 1", "Nozzle 2", "Nozzle 3", "Nozzle 4", "Nozzle 5", "Nozzle 6"],
    },
    {
      id: "2",
      name: "Evening Shift",
      startTime: "14:30",
      endTime: "23:00",
      members: [],
      nozzles: ["Nozzle 1", "Nozzle 2", "Nozzle 3", "Nozzle 4", "Nozzle 5", "Nozzle 6"],
    },
  ]);

  const [newMember, setNewMember] = useState({
    name: "",
    role: "operator",
    availability: { isAvailable: true },
    shiftPreference: "",
    overtime: "No",
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMember.name.trim()) {
      if (members.some((m) => m.name.toLowerCase() === newMember.name.toLowerCase())) {
        alert("Member already exists");
        return;
      }
      const member = {
        id: Date.now().toString(),
        name: newMember.name.trim(),
        role: newMember.role,
        availability: newMember.availability,
        shiftPreference: newMember.shiftPreference,
      };
      setMembers([...members, member]);
      setNewMember({ name: "", role: "operator", availability: { isAvailable: true }, shiftPreference: "" });
    }
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
    setAbsentees(absentees.filter((a) => a !== id));
    setOvertimeMembers(overtimeMembers.filter((o) => o !== id));
    setShiftPreferences((prev) => {
      const updatedPreferences = { ...prev };
      delete updatedPreferences[id];
      return updatedPreferences;
    });
  };

  const handleToggleOvertime = (memberId) => {
    if (overtimeMembers.includes(memberId)) {
      setOvertimeMembers(overtimeMembers.filter((id) => id !== memberId));
    } else {
      setOvertimeMembers([...overtimeMembers, memberId]);
    }
  };

  const handleToggleAvailability = (memberId) => {
    if (absentees.includes(memberId)) {
      setAbsentees(absentees.filter((id) => id !== memberId));
    } else {
      setAbsentees([...absentees, memberId]);
    }
  };

  const handleAssignShifts = () => {
    if (members.length === 0) {
      alert("Please add team members first");
      return;
    }

    const availableMembers = members.filter(
      (m) => m.availability.isAvailable && !absentees.includes(m.id)
    );
    if (availableMembers.length === 3) {
      const morningShift = shifts.find((shift) => shift.name === "Morning Shift");
      const eveningShift = shifts.find((shift) => shift.name === "Evening Shift");

      if (morningShift && eveningShift) {
        const morningMembers = availableMembers.slice(0, 2);
        const eveningMembers = availableMembers.slice(2);

        morningShift.members = morningMembers.map((member) => ({
          ...member,
          isOvertime: overtimeMembers.includes(member.id),
        }));
        eveningShift.members = eveningMembers.map((member) => ({
          ...member,
          isOvertime: overtimeMembers.includes(member.id),
        }));

        setShifts([morningShift, eveningShift]);
      }
    }
    // Shuffle the available members for randomness
    const shuffledMembers = shuffleArray([...availableMembers]);

    const overtimeCandidates = shuffledMembers.filter((m) => overtimeMembers.includes(m.id));

    if (shuffledMembers.length === 0) {
      alert("No members available for assignment");
      return;
    }

    const firstShiftMembers = shuffledMembers.filter(
      (m) => shiftPreferences[m.id] === "1"
    );
    const secondShiftMembers = shuffledMembers.filter(
      (m) => shiftPreferences[m.id] === "2"
    );

    // Assign overtime members if shifts are underfilled
    const unassignedMorningSlots = Math.max(0, shifts[0].nozzles.length - firstShiftMembers.length);
    const unassignedEveningSlots = Math.max(0, shifts[1].nozzles.length - secondShiftMembers.length);

    const morningOvertime = overtimeCandidates.slice(0, unassignedMorningSlots);
    const eveningOvertime = overtimeCandidates.slice(unassignedMorningSlots, unassignedMorningSlots + unassignedEveningSlots);

    setShifts([
      { ...shifts[0], members: [...firstShiftMembers, ...morningOvertime] },
      { ...shifts[1], members: [...secondShiftMembers, ...eveningOvertime] },
    ]);
  };

  return (
    <div className="h-[90%] bg-gray-100 mt-[-30px] p-5">
      <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-5">SHIFT MANAGEMENT SYSTEM</h1>

        {/* Add Member Form */}
        <form onSubmit={handleAddMember} className="mb-5">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter member name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className="border p-2 rounded"
              required
            >
              <option value="operator">Operator</option>
              <option value="supervisor">Supervisor</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newMember.availability.isAvailable}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    availability: { isAvailable: e.target.checked },
                  })
                }
              />
              <span>Available</span>
            </label>
            <select
              value={newMember.shiftPreference}
              onChange={(e) => setNewMember({ ...newMember, shiftPreference: e.target.value })}
              className="border p-2 rounded"
              required
            >
              <option value="" disabled>
                Select Shift Preference
              </option>
              <option value="1">Morning Shift</option>
              <option value="2">Evening Shift</option>
            </select>
            <select
              value={newMember.overtime}
              onChange={(e) => setNewMember({ ...newMember, overtime: e.target.value })}
              className="border p-2 rounded"
              required
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              <FaPlus /> Add Member
            </button>
          </div>
        </form>

        {/* Member List */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold mb-3">Team Members</h2>
          <ul>
            {members.map((member, index) => (
              <li key={member.id} className="flex justify-between items-center mb-2">
                <span>
                  {index + 1}. {member.name} ({member.role})
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!absentees.includes(member.id)}
                      onChange={() => handleToggleAvailability(member.id)}
                      className="mr-2"
                    />
                    <span>{absentees.includes(member.id) ? "Absent" : "Present"}</span>
                  </label>
                  <span>

                    {member.shiftPreference === "1" ? "Morning Shift" : "Evening Shift"}
                  </span>
                  <button
                    onClick={() => handleToggleOvertime(member.id)}
                    className={`px-2 py-1 rounded ml-2 ${overtimeMembers.includes(member.id) ? "bg-yellow-500 text-white" : "bg-gray-300"}`}
                  >
                    Overtime
                  </button>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Shift Assignment */}
        <button onClick={handleAssignShifts} className="block mx-auto bg-green-500 text-white px-4 py-2 rounded mb-5">
          Assign Shifts
        </button>

        {/* Shift Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shifts.map((shift) => (
            <div key={shift.id} className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold">{shift.name}</h3>
              <table className="w-full mt-2">
                <thead>
                  <tr>
                    <th className="text-left border-b">Nozzle</th>
                    <th className="text-left border-b">Member</th>
                    <th className="text-left border-b">Role</th>
                    <th className="text-left border-b">Overtime</th>
                  </tr>
                </thead>
                <tbody>
                  {shift.nozzles.map((nozzle, index) => (
                    <tr key={index}>
                      <td className="py-1">{nozzle}</td>
                      <td className="py-1">
                        {shift.members[index]?.name || "Unassigned"}
                      </td>
                      <td className="py-1">
                        {shift.members[index]?.role || "Unassigned"}
                      </td>
                      <td className="py-1">
                        {shift.members[index] && overtimeMembers.includes(shift.members[index].id)
                          ? "🟢"
                          : "🔴"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShiftManagementSystem;