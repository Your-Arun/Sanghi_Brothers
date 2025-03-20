import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import BackButton from "../Home Page/backbutton"; // Import the context
import axiosInstance from "../Dashboard/axiosInstance";
import ShiftList from '../Home Page/ShiftContext'

const ShiftManagementSystem = () => {
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
    role: "operator🔫",
    shift: '',
    available: '',
  });
  useEffect(() => {
    if (shifts.length > 0) {
      saveAssignedShifts();
    }
  }, [shifts]);
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get("/shifting");
        setMembers(response.data);
        setAbsentMembers(response.data.filter((m) => m.available === "absent"));
      } catch (error) {
        alert("Error fetching members:");
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
      alert("Error updating availability:");
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
  const saveAssignedShifts = async () => {
    console.log("Saving shifts...");
  
    try {
      const shiftData = shifts.map((shift) => ({
        date: date, // Ensure `date` is available in your state
        shiftType: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        supervisor: shift.supervisor ? shift.supervisor.name : "Not Assigned",
        airBoy: shift.airBoy ? shift.airBoy.name : "Not Assigned",
        nozzles: shift.nozzles.map((nozzle, index) => ({
          nozzleNumber: nozzle,
          member: shift.members[index] ? shift.members[index].name : "Unassigned",
          overtime: shift.members[index]
            ? morningOvertimeMembers.includes(shift.members[index]._id) || eveningOvertimeMembers.includes(shift.members[index]._id)
            : false,
        })),
      }));
  
      console.log("Shift data to save:", shiftData);
  
      // API call to save shift assignments
      await axiosInstance.post("/shifting/save", { shifts: shiftData });
  
      alert("Shift data saved successfully!");
    } catch (error) {
      console.error("Error saving shift data:", error);
      alert("Failed to save shift data.");
    }
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
      let morningMembers = availableMembers.filter(
        (m) => m.shift === "morning" && m.role === "operator"
      );
      let eveningMembers = availableMembers.filter(
        (m) => m.shift === "evening" && m.role === "operator"
      );

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

      morningMembers.forEach(member => member.free = false);
      setShifts([morningShift, eveningShift]);
      // Save shifts after assigning
      saveAssignedShifts();
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
  const [date, setDate] = useState('');
  useEffect(() => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');
    setDate(`${day}/${month}/${year}`);
  }, []);

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
          {isOvertime ? "Overtime ✅" : "❌ Overtime"}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="h-[90%] w-full bg-transparent p-5 ">
      <h1 className="text-3xl font-bold text-center mb-5">SHIFT MANAGEMENT SYSTEM</h1>
      <div className=" md:grid-cols-2 gap-4">
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
                <option value="operator">Operator🔫</option>
                <option value="supervisor">Supervisor🧑‍💼</option>
                <option value="air boy">Air Boy🌀</option>
              </select>
              <select
                value={newMember.shift}
                onChange={(e) => setNewMember({ ...newMember, shift: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[130px]"
              >
                <option value="">Select Shift</option>
                <option value="morning">Morning🌄</option>
                <option value="evening">Evening🌆</option>
              </select>
              <select
                value={newMember.available}
                onChange={(e) => setNewMember({ ...newMember, available: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[130px]"
              >
                <option value="">Select Availability</option>
                <option value="present">Present🟢</option>
                <option value="absent">Absent🔴</option>
              </select>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1 min-w-[80px]">
                <FaPlus /> Add
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-md mt-5">
          <h2 className="text-lg md:text-xl font-semibold text-center mb-2">Member List</h2>

          <div className="overflow-x-auto">
            <ul className="w-full max-w-3xl mx-auto">
              {members.map((member, index) => (
                <li key={member._id} className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-2">
                  {/* Name */}
                  <span className="text-sm md:text-base w-[15%]">{index + 1}. {member.name.toUpperCase()}</span>

                  {/* Role Dropdown */}
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member._id, e.target.value)}
                    className="border p-1 rounded text-sm w-[15%]"
                  >
                    <option value="operator">Operator</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="air boy">Air Boy</option>
                  </select>

                  {/* Availability Toggle */}
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input class="sr-only peer" value="" type="checkbox"
                      checked={member.available === "present"} onChange={() => handleUpdateAvailability(member._id, member.available === "present" ? "absent" : "present", null)}
                    />
                    <div class="peer rounded-full outline-none duration-100 after:duration-500
                     w-20 h-8 bg-sky-500 peer-focus:outline-none peer-focus:ring-4 
                     peer-focus:ring-blue-500  after:content-['A'] after:absolute 
                     after:outline-none after:rounded-full after:h-6 after:w-6 after:bg-white 
                     after:top-1 after:left-1 after:flex after:justify-center after:items-center  
                     after:text-sky-800 after:font-bold peer-checked:after:translate-x-10
                      peer-checked:after:content-['P'] peer-checked:after:border-white ">
                    </div>
                  </label>

                  {/* Shift Dropdown */}
                  <select
                    value={member.shift}
                    onChange={(e) => handleUpdateShift(member._id, e.target.value)}
                    className="border p-1 rounded text-sm w-[15%]"
                  >
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                  </select>

                  {/* Delete Button */}
                  <button onClick={() => handleRemoveMember(member._id)}
                    class="group relative flex h-10 w-10 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600"
                  >
                    <svg
                      viewBox="0 0 1.625 1.625"
                      class="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
                      height="15"
                      width="15"
                    >
                      <path
                        d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"
                      ></path>
                      <path
                        d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"
                      ></path>
                      <path
                        d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"
                      ></path>
                    </svg>
                    <svg
                      width="16"
                      fill="none"
                      viewBox="0 0 39 7"
                      class="origin-right duration-500 group-hover:rotate-90"
                    >
                      <line stroke-width="4" stroke="white" y2="5" x2="39" y1="5"></line>
                      <line
                        stroke-width="3"
                        stroke="white"
                        y2="1.5"
                        x2="26.0357"
                        y1="1.5"
                        x1="12"
                      ></line>
                    </svg>
                    <svg width="16" fill="none" viewBox="0 0 33 39" class="">
                      <mask fill="white" id="path-1-inside-1_8_19">
                        <path
                          d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                        ></path>
                      </mask>
                      <path
                        mask="url(#path-1-inside-1_8_19)"
                        fill="white"
                        d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                      ></path>
                      <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
                      <path stroke-width="4" stroke="white" d="M21 6V29"></path>
                    </svg>
                  </button>

                </li>
              ))}
            </ul>
          </div>

          {/* Absent Members Section */}
          <div className="mt-4">
            <h2 className="text-lg md:text-xl font-semibold text-center mb-2">Absent Members</h2>

            <ul className="list-none p-0 m-0 w-full max-w-3xl mx-auto">
              {absentMembers.map((member) => (
                <li key={member._id} className="flex flex-wrap items-center justify-between gap-2 border p-2 rounded mb-1">
                  <div className="text-sm w-[20%] text-center">{member.name.toUpperCase()}</div>
                  <div className="text-sm w-[20%] text-center">Role: {member.role}</div>
                  <div className="text-sm w-[20%] text-center">Shift: {member.shift}</div>
                  <button
                    onClick={() => handleUpdateAvailability(member._id, "present", null)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 transition w-[20%]"
                  >
                    Mark as Present
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
      <div className="flex justify-center mt-5">
        <button onClick={handleAssignShiftsAndOvertime} className="bg-green-500 text-white px-4 py-2 rounded">
          Assign Shifts
        </button>
      </div>


      <div>
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
      </div>

      <div>
        <BackButton previousImage="/previous.png" />
      </div>
    </div>
  );
};

export default ShiftManagementSystem;

