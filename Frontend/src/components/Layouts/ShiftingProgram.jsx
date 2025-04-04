import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import BackButton from "../Home Page/backbutton"; // Import the context
import axiosInstance from "../Dashboard/axiosInstance";
import { useNavigate } from "react-router-dom"; import { IoTrashBinOutline } from "react-icons/io5";
import { toast } from 'react-toastify'

const ShiftManagementSystem = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [members, setMembers] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [absentMembers, setAbsentMembers] = useState([]);
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
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get("/shifting");
        setMembers(response.data);
        setAbsentMembers(response.data.filter((m) => m.available === "absent"));
      } catch (error) {
        toast.warn("Error fetching members:");
      }
    };
    fetchMembers();
  }, []);
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (newMember.name.trim()) {
      try {
        const response = await axiosInstance.post("/shifting", newMember);
        const savedMember = response.data;
        setMembers([...members, savedMember]);
        setNewMember({ name: "", role: "", shift: "", available: "" });
      } catch (error) {
        alert("Failed to save member. Please try again.");
      }
    }
  };
  const handleRemoveMember = async (id) => {
    if (!id) return;
    try {
      await axiosInstance.delete(`/shifting/${id}`);
      setMembers(members.filter((m) => m._id !== id));
    } catch (error) {
      alert("Failed to delete member.");
    }
  };
  const handleUpdateAvailability = async (id, status) => {
    try {
      await axiosInstance.put(`/shifting/${id}`, { available: status });
      setMembers(members.map((m) => (m._id === id ? { ...m, available: status } : m)));
      if (status === "absent") {
        setAbsentMembers((prev) => [...prev.filter((m) => m._id !== id), members.find((m) => m._id === id)]);
      } else {
        setAbsentMembers(absentMembers.filter((m) => m._id !== id));
      }
    } catch (error) {
      toast.warn("Error updating availability:");
    }
  };
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const saveAssignedShifts = async (shifts, morningOvertimeMembers, eveningOvertimeMembers) => {
    try {
      const shiftData = shifts.map((shift) => {
        const nozzles = shift.nozzles || [1, 2, 3, 4, 5, 6]; // Ensure nozzle sequence
        const members = shift.members || []; // Use members directly, no shuffle

        return {
          date: date,
          shiftType: shift.name,
          startTime: shift.startTime,
          endTime: shift.endTime,
          supervisor: shift.supervisor ? shift.supervisor.name : "Not Assigned",
          airBoy: shift.airBoy ? shift.airBoy.name : "Not Assigned",
          nozzles: nozzles.map((nozzle, index) => {
            const assignedMember = members[index] || null;

            // Check if the member is in the correct overtime array based on the shift type
            const isOvertime =
              assignedMember &&
              (shift.name === "Morning Shift"
                ? morningOvertimeMembers.includes(assignedMember._id)
                : eveningOvertimeMembers.includes(assignedMember._id));

            return {
              nozzleNumber: `Nozzle ${index + 1}`,
              member: assignedMember ? assignedMember.name : "Unassigned",
              overtime: isOvertime,
            };
          }),
        };
      });
      if (!date) {
        toast.warning('Please select Date')
      }
      await axiosInstance.post("/shiftingsavee", shiftData);
      toast.success("Shift data saved successfully!");
    } catch (error) {
      toast.warn("Failed to save shift data.");
    }
  };
  const handleAssignMorningShift = () => {
    if (members.length === 0) {
      alert("Please add team members first");
      return;
    }

    const availableMembers = members.filter(
      (m) => m.available === "present" && !absentees.includes(m._id)
    );

    const morningShift = shifts.find((shift) => shift.name === "Morning Shift");

    if (morningShift) {
      let morningMembers = availableMembers.filter(
        (m) => m.shift === "morning" && m.role === "operator"
      );

      morningMembers = shuffleArray([...morningMembers]);

      const unassignedMorning = Math.max(0, morningShift.nozzles.length - morningMembers.length);

      let overtimeCandidatesMorning = availableMembers.filter(m => !morningOvertimeMembers.includes(m._id) && m.shift === "evening" && m.role === "operator");
      overtimeCandidatesMorning = shuffleArray([...overtimeCandidatesMorning]);

      let morningOvertime = [];
      if (unassignedMorning > 0) {
        if (unassignedMorning === 1) {
          morningOvertime.push(overtimeCandidatesMorning.shift());
        } else {
          morningOvertime.push(overtimeCandidatesMorning.shift());
          morningOvertime.push(overtimeCandidatesMorning.shift());
        }
      }

      morningShift.members = shuffleArray([...morningMembers, ...morningOvertime]);
      setMorningOvertimeMembers(morningOvertime.map(m => m._id));

      morningShift.supervisor = availableMembers.find(m => m.role === "supervisor" && m.shift === "morning");
      morningShift.airBoy = availableMembers.find(m => m.role === "air boy" && m.shift === "morning");

      morningMembers.forEach(member => member.free = false);
      setShifts([morningShift, shifts[1]]);

      const updatedMorningOvertimeMembers = morningOvertime.map(m => m._id);
      saveAssignedShifts([morningShift, shifts[1]], updatedMorningOvertimeMembers, eveningOvertimeMembers);
    }
  };
  const handleAssignEveningShift = () => {
    if (members.length === 0) {
      alert("Please add team members first");
      return;
    }

    const availableMembers = members.filter(
      (m) => m.available === "present" && !absentees.includes(m._id)
    );

    const eveningShift = shifts.find((shift) => shift.name === "Evening Shift");

    if (eveningShift) {
      let eveningMembers = availableMembers.filter(
        (m) => m.shift === "evening" && m.role === "operator"
      );

      eveningMembers = shuffleArray([...eveningMembers]);

      const unassignedEvening = Math.max(0, eveningShift.nozzles.length - eveningMembers.length);

      let overtimeCandidatesEvening = availableMembers.filter(m => !eveningOvertimeMembers.includes(m._id) && m.shift === "morning" && m.role === "operator");
      overtimeCandidatesEvening = shuffleArray([...overtimeCandidatesEvening]);

      let eveningOvertime = [];
      if (unassignedEvening > 0) {
        if (unassignedEvening === 1) {
          eveningOvertime.push(overtimeCandidatesEvening.shift());
        } else {
          eveningOvertime.push(overtimeCandidatesEvening.shift());
          eveningOvertime.push(overtimeCandidatesEvening.shift());
        }
      }

      eveningShift.members = shuffleArray([...eveningMembers, ...eveningOvertime]);
      setEveningOvertimeMembers(eveningOvertime.map(m => m._id));

      eveningShift.supervisor = availableMembers.find(m => m.role === "supervisor" && m.shift === "evening");
      eveningShift.airBoy = availableMembers.find(m => m.role === "air boy" && m.shift === "evening");

      eveningMembers.forEach(member => member.free = false);
      setShifts([shifts[0], eveningShift]);

      const updatedEveningOvertimeMembers = eveningOvertime.map(m => m._id);
      saveAssignedShifts([shifts[0], eveningShift], morningOvertimeMembers, updatedEveningOvertimeMembers);
    }
  };
  const handleRoleChange = async (id, newRole) => {
    try {
      await axiosInstance.put(`/shifting/${id}`, { role: newRole });
      setMembers(members.map((m) => (m._id === id ? { ...m, role: newRole } : m)));
    } catch (error) {
      alert("Error updating role");
    }
  };
  const handleUpdateShift = async (id, shift) => {
    try {
      await axiosInstance.put(`/shifting/${id}`, { shift });
      setMembers(members.map((m) => (m._id === id ? { ...m, shift } : m)));
    } catch (error) {
      alert("Error updating shift:", error);
    }
  };
  const ShiftRow = ({ nozzle, member, isOvertime }) => (
    <tr className="hover:bg-gray-100 transition">
      <td className="py-2 px-3 border text-center">{nozzle}</td>
      <td className="py-2 px-3 border text-center">
        {member?.name || <span className="text-gray-400 italic">Unassigned</span>}
      </td>
      <td className="py-2 px-3 border text-center">
        <span
          className={`px-2 py-1 rounded-lg text-xs font-bold ${isOvertime ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
        >
          {isOvertime ? "Overtime " : " Overtime"}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-5">SHIFT MANAGEMENT SYSTEM</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-center mb-2">Add Member</h2>
          <form onSubmit={handleAddMember} className="mb-4">
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Enter member name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[150px]"
              />
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[130px]"
              >
                <option value="">Select Role</option>
                <option value="operator">Operator</option>
                <option value="supervisor">Supervisor</option>
                <option value="air boy">Air Boy</option>
              </select>
              <select
                value={newMember.shift}
                onChange={(e) => setNewMember({ ...newMember, shift: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[130px]"
              >
                <option value="">Select Shift</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
              <select
                value={newMember.available}
                onChange={(e) => setNewMember({ ...newMember, available: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[130px]"
              >
                <option value="">Select Availability</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1 min-w-[80px]">
                <FaPlus /> Add
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-md mt-5">
          <h2 className="text-xl md:text-xl font-semibold text-center mb-2">Member List</h2>
          <div className="overflow-x-auto p-4">
            <ul className="w-full max-w-3xl mx-auto">
              {members.map((member, index) => (
                <li key={member._id} className="grid grid-cols-5 items-center gap-2 p-2 border-b">
                  {/* Name */}
                  <span className="text-sm md:text-base font-medium">{index + 1}. {member.name.toUpperCase()}</span>

                  {/* Role Dropdown */}
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member._id, e.target.value)}
                    className="border p-1 rounded text-sm w-full bg-gray-50"
                  >
                    <option value="operator">Operator</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="air boy">Air Boy</option>
                  </select>

                  {/* Availability Toggle */}
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" checked={member.available === "present"} onChange={() => handleUpdateAvailability(member._id, member.available === "present" ? "absent" : "present", null)} className="sr-only peer" />
                    <div className="w-16 h-7 bg-gray-300 peer-checked:bg-green-500 rounded-full flex items-center p-1 transition">
                      <span className="w-6 h-6 bg-white rounded-full shadow transform transition peer-checked:translate-x-9 flex items-center justify-center text-xs font-bold text-gray-700 peer-checked:text-green-700">
                        {member.available === "present" ? "P" : "A"}
                      </span>
                    </div>
                  </label>

                  {/* Shift Dropdown */}
                  <select
                    value={member.shift}
                    onChange={(e) => handleUpdateShift(member._id, e.target.value)}
                    className="border p-1 rounded text-sm w-full bg-gray-50"
                  >
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                  </select>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="p-2 hover:bg-red-700 hover:text-white text-red-500 rounded-lg transition flex items-center justify-center"
                  >
                    <IoTrashBinOutline className="text-lg" />
                  </button>

                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <span className="text-lg font-bold text-green-600">Present: {members.filter(m => m.available === "present").length}</span>
            <span className="text-lg font-bold text-red-600">Absent: {members.filter(m => m.available === "absent").length}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-evenly mt-5">
        <div >
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            <input type="date" className="bg-transparent border-none p-0" value={date} onChange={handleDateChange} />
          </button>
        </div>
        <div className="flex gap-4">
          <button onClick={handleAssignMorningShift} className="bg-blue-500 text-white px-4 py-2 rounded">
            Assign Morning Shift
          </button>
          <button onClick={handleAssignEveningShift} className="bg-orange-400 text-white px-4 py-2 rounded">
            Assign Evening Shift
          </button>
        </div>
        <div>
          <button onClick={() => navigate('/allshifting')} className="bg-green-500 text-white px-4 py-2 rounded">
            All Shifts
          </button>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-5 mb-4">
          {shifts.map((shift) => {
            const nozzles = shift.nozzles || [1, 2, 3, 4, 5, 6];
            const members = shift.members || [];

            return (
              <div
                key={shift.id}
                className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-3xl font-bold text-gray-800 text-center">{shift.name}</h3>
                <p className="text-lg text-gray-600 text-center mt-1"> {date || "Not Assigned"}</p>
                <p className="text-lg font-medium text-center text-indigo-600 mt-1">
                  {shift.startTime} A.M - {shift.endTime} P.M
                </p>

                <div className="flex justify-between items-center bg-gray-100 p-3 mt-3 rounded-lg">
                  {shift?.supervisor && (
                    <span className="font-semibold text-gray-700 mr-10">
                      Supervisor: <span className="text-blue-600">{shift.supervisor.name.toUpperCase()}</span>
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
                        <th className="py-2 px-3 border">Nozzle</th>
                        <th className="py-2 px-3 border">Member</th>
                        <th className="py-2 px-3 border">Overtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nozzles.map((nozzle, index) => {
                        const member = members[index] || null;
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
      </div>
      <div>
        <BackButton previousImage="/previous.png" />
      </div>
    </div>
  );
};

export default ShiftManagementSystem;