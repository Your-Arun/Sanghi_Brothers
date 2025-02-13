import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from 'axios';
import previousImage from '/public/previous.png';
import saveImage from '/public/save.png';
import { Link } from "react-router-dom";

const ShiftManagementSystem = () => {
  const [members, setMembers] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [morningOvertimeMembers, setMorningOvertimeMembers] = useState([]);
  const [eveningOvertimeMembers, setEveningOvertimeMembers] = useState([]);
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
        setNewMember({ name: "", role: "", shift: "", available: "" });
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

  const handleUpdateAvailability = async (id, status) => {
    try {
      await axios.put(`http://localhost:5500/shifting/${id}`, { available: status });
      setMembers(members.map((m) => (m._id === id ? { ...m, available: status } : m)));
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAssignShiftsAndOvertime = () => {
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
      let morningMembers = availableMembers.filter((m) => m.shift === "morning" && m.role === "operator");
      let eveningMembers = availableMembers.filter((m) => m.shift === "evening" && m.role === "operator");

      morningMembers = shuffleArray([...morningMembers]);
      eveningMembers = shuffleArray([...eveningMembers]);

      morningShift.members = morningMembers;
      eveningShift.members = eveningMembers;

      const unassignedMorning = Math.max(0, morningShift.nozzles.length - morningMembers.length);
      const unassignedEvening = Math.max(0, eveningShift.nozzles.length - eveningMembers.length);

      let overtimeCandidatesMorning = eveningMembers.filter(m => !eveningOvertimeMembers.includes(m._id));
      let overtimeCandidatesEvening = morningMembers.filter(m => !morningOvertimeMembers.includes(m._id));

      const morningOvertime = overtimeCandidatesMorning.slice(0, unassignedMorning);
      const eveningOvertime = overtimeCandidatesEvening.slice(0, unassignedEvening);

      morningShift.members = [...morningShift.members, ...morningOvertime];
      eveningShift.members = [...eveningShift.members, ...eveningOvertime];

      setMorningOvertimeMembers(morningOvertime.map(m => m._id));
      setEveningOvertimeMembers(eveningOvertime.map(m => m._id));

      morningShift.supervisor = availableMembers.find(m => m.role === "supervisor" && m.shift === "morning");
      eveningShift.supervisor = availableMembers.find(m => m.role === "supervisor" && m.shift === "evening");

      morningShift.airBoy = availableMembers.find(m => m.role === "air boy" && m.shift === "morning");
      eveningShift.airBoy = availableMembers.find(m => m.role === "air boy" && m.shift === "evening");

      setShifts([morningShift, eveningShift]);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 p-5">
      <div className="flex justify-between items-center mb-6">
        <Link to={'/dashboard'}>
          <img src={previousImage} width={50} alt="Back" />
        </Link>
        <div className="grid grid-row-2 items-center gap-2">
          {' '}
          <h1 className="text-3xl font-bold text-center mb-5">SHIFT MANAGEMENT SYSTEM</h1>
        </div>
        <button>
          <img src={saveImage} width={50} alt="Save" />
        </button>
      </div>

      <div className=" md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-2xl mb-2 font-semibold text-center">Add Member</h2>
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
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="text-2xl mb-2 font-semibold text-center">Member List</h2>
          <ul>
            {members.map((member, index) => (
              <li key={member._id} className="flex justify-between items-center mb-2">
                <span>{index + 1}. {member.name.toUpperCase()} - ({member.role.toUpperCase()})</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={member.available === "present"}
                      onChange={() => handleUpdateAvailability(member._id, member.available === "present" ? "absent" : "present")}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <label className="ml-2">{member.available === "present" ? "Present" : "Absent"}</label>
                  </label>
                  <span>Shift: {member.shift.toUpperCase()}</span>
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
      </div>

      <div className="flex justify-center mt-5">
        <button onClick={handleAssignShiftsAndOvertime} className="bg-green-500 text-white px-4 py-2 rounded">
          Assign Shifts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
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
                      {shift.members[index] && (shift.name === "Morning Shift" ? morningOvertimeMembers.includes(shift.members[index]._id) : eveningOvertimeMembers.includes(shift.members[index]._id))
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
  );
};

export default ShiftManagementSystem;