import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from 'axios';

const ShiftManagementSystem = () => {
  const [members, setMembers] = useState([]);
  const [absentees, setAbsentees] = useState([]);
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
    shift: '',
    overtime: '',
    available: '',
  });
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5500/shifting");
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (newMember.name.trim()) {
      try {
        const response = await axios.post("http://localhost:5500/shifting", newMember);
        const savedMember = response.data;
        setMembers([...members, savedMember]);
        setNewMember({ name: "", role: "", shift: "", available: "", overtime: "" });
      } catch (error) {
        console.error("Error saving member:", error);
        alert("Failed to save member. Please try again.");
      }
    }
  };
  const handleRemoveMember = async (id) => {
    if (id === undefined) {
      console.error("Error: id is undefined");
      return;
    }

    try {
      await axios.delete(`http://localhost:5500/shifting/${id}`);
      setMembers(members.filter((m) => m._id !== id)); // Use _id instead of id
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member. Please try again.");
    }
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
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const handleAssignShifts = () => {
    if (members.length === 0) {
      alert("Please add team members first");
      return;
    }

    const availableMembers = members.filter(
      (m) => m.available === "present" && !absentees.includes(m._id)
    );

    const morningShift = shifts.find((shift) => shift.name === "Morning Shift");
    const eveningShift = shifts.find((shift) => shift.name === "Evening Shift");

    if (morningShift && eveningShift) {
      const morningMembers = availableMembers.filter((m) => m.shift === "morning" && m.role !== "supervisor" && m.role !== "air boy");
      const eveningMembers = availableMembers.filter((m) => m.shift === "evening" && m.role !== "supervisor" && m.role !== "air boy");

      const shuffledMorningMembers = shuffleArray([...morningMembers]);
      const shuffledEveningMembers = shuffleArray([...eveningMembers]);

      morningShift.members = shuffledMorningMembers;
      eveningShift.members = shuffledEveningMembers;

      // Assign overtime members
      const overtimeCandidates = availableMembers.filter((m) => overtimeMembers.includes(m._id));
      const unassignedMorningSlots = Math.max(0, morningShift.nozzles.length - morningShift.members.length);
      const unassignedEveningSlots = Math.max(0, eveningShift.nozzles.length - eveningShift.members.length);
      const morningOvertime = overtimeCandidates.slice(0, unassignedMorningSlots);
      const eveningOvertime = overtimeCandidates.slice(unassignedMorningSlots, unassignedMorningSlots + unassignedEveningSlots);
      morningShift.members = [...morningShift.members, ...morningOvertime];
      eveningShift.members = [...eveningShift.members, ...eveningOvertime];
      // Assign supervisors and air boys
      const morningSupervisors = availableMembers.filter((m) => m.role === "supervisor" && m.shift === "morning");
      const eveningSupervisors = availableMembers.filter((m) => m.role === "supervisor" && m.shift === "evening");
      const morningAirBoys = availableMembers.filter((m) => m.role === "air boy" && m.shift === "morning");
      const eveningAirBoys = availableMembers.filter((m) => m.role === "air boy" && m.shift === "evening");
      morningShift.supervisor = morningSupervisors[0];
      eveningShift.supervisor = eveningSupervisors[0];
      morningShift.airBoy = morningAirBoys[0];
      eveningShift.airBoy = eveningAirBoys[0];
      setShifts([morningShift, eveningShift]);
    }
  };
  return (
    <div className="h-[90%] bg-gray-100 mt-[-30px] p-5">
      <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-5">SHIFT MANAGEMENT SYSTEM</h1>

        {/* Add Member Form */}
        <form onSubmit={handleAddMember} className="mb-5">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter member name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Role</option>
              <option value="operator">Operator</option>
              <option value="supervisor">Supervisor</option>
              <option value="air boy">Air Boy</option>
            </select>
            <select
              value={newMember.shift}
              onChange={(e) => setNewMember({ ...newMember, shift: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Shift</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
            <select
              value={newMember.available}
              onChange={(e) => setNewMember({ ...newMember, available: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Availability</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              <FaPlus /> Add
            </button>
          </div>
        </form>

        {/* Member List */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold mb-3">Team Members</h2>
          <ul>
            {members.map((member, index) => (
              <li key={member._id} className="flex justify-between items-center mb-2">
                <span>{index + 1}. {member.name}</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!absentees.includes(member._id)}
                      onChange={() => handleToggleAvailability(member._id)}
                      className="mr-2"
                    />
                    <span>{absentees.includes(member._id) ? "Absent" : "Present"}</span>
                  </label>
                  <span>Shift: {member.shift.toUpperCase()}</span>
                  <button
                    onClick={() => handleToggleOvertime(member._id)}
                    className={`px-2 py-1 rounded ml-2 ${overtimeMembers.includes(member._id) ? "bg-yellow-500 text-white" : "bg-gray-300"}`}
                  >
                    Overtime
                  </button>
                  <button
                    onClick={() => handleRemoveMember(member._id)}
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
        <button onClick={handleAssignShifts} className="block mx-auto bg-green-500 text-white px-4 py-2 rounded mb-5 ">
          Assign Shifts
        </button>

        {/* Shift Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shifts.map((shift) => (
            <div key={shift.id} className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-2xl mb-2 font-semibold text-center">{shift.name}</h3>
              <strong className="flex justify-evenly"> {shift.supervisor && <span>Supervisor: {shift.supervisor.name.toUpperCase()}</span>}
                <div className="text-center">{shift.airBoy && <span>Air Boy: {shift.airBoy.name.toUpperCase()}</span>}</div></strong>
              <table className="w-full mt-2">
                <thead>
                  <tr>
                    <th className="text-left border-b">Nozzle</th>
                    <th className="text-left border-b">Member</th>
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
                        {shift.members[index] && overtimeMembers.includes(shift.members[index]._id)
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