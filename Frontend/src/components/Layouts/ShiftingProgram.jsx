import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import BackButton from "../Home Page/backbutton"; // Import the context
import axiosInstance from "../Dashboard/axiosInstance";
import { useNavigate } from "react-router-dom"; import { IoTrashBinOutline } from "react-icons/io5";
import { toast } from 'react-toastify'

const ShiftManagementSystem = () => {

const [showadd, setshowAdd]=useState(false);


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


  const confirmDeleteToast = (onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this ?</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                onConfirm()
                closeToast()
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    )
  }
  const handleRemoveMember = async (id) => {
    confirmDeleteToast(async () => {
      if (!id) return;
      try {
        await axiosInstance.delete(`/shifting/${id}`);
        setMembers(members.filter((m) => m._id !== id));
      } catch (error) {
        alert("Failed to delete member.");
      }
    })
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
        const nozzles = shift.nozzles || [1, 2, 3, 4, 5, 6];
        const members = shift.members || [];

        const isMorning = shift.name === "Morning Shift";
        const overtimeList = isMorning ? morningOvertimeMembers : eveningOvertimeMembers;

        return {
          date: date,
          shiftType: shift.name,
          startTime: shift.startTime,
          endTime: shift.endTime,
          supervisor: shift.supervisor ? shift.supervisor.name : "Not Assigned",
          airBoy: shift.airBoy ? shift.airBoy.name : "Not Assigned",
          extraOperator: shift.extraOperator ? shift.extraOperator.name : "Not Assigned", // ✅ new field
          nozzles: nozzles.map((nozzle, index) => {
            const assignedMember = members[index] || null;
            const isOvertime = assignedMember && overtimeList.includes(assignedMember._id);

            return {
              nozzleNumber: `Nozzle ${index + 1}`,
              member: assignedMember ? assignedMember.name : "Unassigned",
              overtime: isOvertime,
            };
          }),
        };
      });

      if (!date) {
        toast.warning("Please select Date");
        return;
      }

      await axiosInstance.post("/shiftingsavee", shiftData);
      toast.success("Shift data saved successfully!");
    } catch (error) {
      toast.warn("Failed to save shift data.");
      console.error(error);
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

      let overtimeCandidatesMorning = availableMembers.filter(
        (m) =>
          !morningOvertimeMembers.includes(m._id) &&
          m.shift === "evening" &&
          m.role === "operator"
      );
      overtimeCandidatesMorning = shuffleArray([...overtimeCandidatesMorning]);

      let morningOvertime = [];
      if (unassignedMorning > 0) {
        morningOvertime.push(...overtimeCandidatesMorning.splice(0, Math.min(2, unassignedMorning)));
      }

      // 🟩 Combine morning + overtime
      let finalMorningOperators = shuffleArray([...morningMembers, ...morningOvertime]);

      // 🟨 Check if extra operator is available (more than 6, and no overtime used)
      let extraOperator = null;
      if (
        finalMorningOperators.length > morningShift.nozzles.length &&
        morningOvertime.length === 0
      ) {
        extraOperator = finalMorningOperators.pop(); // Remove 1 extra to show separately
      }

      // 🟦 Set members to shift
      morningShift.members = finalMorningOperators;
      setMorningOvertimeMembers(morningOvertime.map((m) => m._id));

      morningShift.supervisor = availableMembers.find(
        (m) => m.role === "supervisor" && m.shift === "morning"
      );
      morningShift.airBoy = availableMembers.find(
        (m) => m.role === "air boy" && m.shift === "morning"
      );

      // 🟧 Save extra operator (new field)
      morningShift.extraOperator = extraOperator || null;

      morningMembers.forEach((member) => (member.free = false));
      setShifts([morningShift, shifts[1]]);

      saveAssignedShifts(
        [morningShift],
        morningOvertime.map((m) => m._id),
        eveningOvertimeMembers
      );
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

      let overtimeCandidatesEvening = availableMembers.filter(
        (m) =>
          !eveningOvertimeMembers.includes(m._id) &&
          m.shift === "morning" &&
          m.role === "operator"
      );
      overtimeCandidatesEvening = shuffleArray([...overtimeCandidatesEvening]);

      let eveningOvertime = [];
      if (unassignedEvening > 0) {
        eveningOvertime.push(...overtimeCandidatesEvening.splice(0, Math.min(2, unassignedEvening)));
      }

      // 🟩 Combine evening members + overtime
      let finalEveningOperators = shuffleArray([...eveningMembers, ...eveningOvertime]);

      // 🟨 Check for extra operator if no overtime used and more than needed
      let extraOperator = null;
      if (
        finalEveningOperators.length > eveningShift.nozzles.length &&
        eveningOvertime.length === 0
      ) {
        extraOperator = finalEveningOperators.pop(); // Remove & display separately
      }

      eveningShift.members = finalEveningOperators;
      setEveningOvertimeMembers(eveningOvertime.map((m) => m._id));

      eveningShift.supervisor = availableMembers.find(
        (m) => m.role === "supervisor" && m.shift === "evening"
      );
      eveningShift.airBoy = availableMembers.find(
        (m) => m.role === "air boy" && m.shift === "evening"
      );

      // 🟧 Save extraOperator in shift object
      eveningShift.extraOperator = extraOperator || null;

      eveningMembers.forEach((member) => (member.free = false));
      setShifts([shifts[0], eveningShift]);

      const updatedEveningOvertimeMembers = eveningOvertime.map((m) => m._id);
      saveAssignedShifts(
        [eveningShift],
        morningOvertimeMembers,
        updatedEveningOvertimeMembers
      );
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
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl fo nt-bold  bg-gradient-to-r from-blue-800 to-yellow-800 text-transparent bg-clip-text text-center mb-5">SHIFT MANAGEMENT SYSTEM</h1>

      <button
  onClick={() => setshowAdd(true)}
  className="fixed top-20 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition"
>
  <FaPlus className="text-xl" />
</button>



      <div className="flex flex-col items-center justify-start min-h-screen p-6 overflow-x-hidden">
      
        {/* Member List Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-7xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">👥 Member List</h2>

          {/* Member Table Style */}
          <div className="max-h-[60vh] overflow-y-auto rounded-lg shadow-inner">
            <table className="w-full text-sm md:text-base table-fixed border border-gray-200">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3 w-[5%]">#</th>
                  <th className="p-3 w-[25%]">Name</th>
                  <th className="p-3 w-[20%]">Role</th>
                  <th className="p-3 w-[20%]">Availability</th>
                  <th className="p-3 w-[20%]">Shift</th>
                  <th className="p-3 w-[10%] text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{index + 1}</td>
                    <td className="p-3 font-medium">{member.name.toUpperCase()}</td>
                    <td className="p-3">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member._id, e.target.value)}
                        className="border p-2 rounded w-full"
                      >
                        <option value="operator">Operator</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="air boy">Air Boy</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={member.available === "present"} onChange={() =>
                          handleUpdateAvailability(member._id, member.available === "present" ? "absent" : "present", null)
                        } className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-300 peer-checked:bg-green-500 rounded-full p-1 transition-all">
                          <div className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 flex items-center justify-center text-xs font-bold ${member.available === "present" ? "translate-x-7 text-green-600" : "translate-x-0 text-gray-600"}`}>
                            {member.available === "present" ? "P" : "A"}
                          </div>
                        </div>
                      </label>
                    </td>
                    <td className="p-3">
                      <select
                        value={member.shift}
                        onChange={(e) => handleUpdateShift(member._id, e.target.value)}
                        className="border p-2 rounded w-full"
                      >
                        <option value="morning">Morning</option>
                        <option value="evening">Evening</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <div
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-full transition"
                      >
                        <IoTrashBinOutline className="text-lg text-center " />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-center items-center gap-6 mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
            <span className="text-lg font-bold text-green-600">✅ Present: {members.filter(m => m.available === "present").length}</span>
            <span className="text-lg font-bold text-red-600">❌ Absent: {members.filter(m => m.available === "absent").length}</span>
          </div>
        </div>
      </div>




      <div className="flex justify-evenly mt-5 gap-4">
        <div >
          <div className="bg-green-500 text-white px-4 py-2 rounded">
            <input type="date" className="bg-transparent border-none p-0" value={date} onChange={handleDateChange} />
          </div>
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
          <div onClick={() => navigate('/allshifting')} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
            All Shifts
          </div>
        </div>
      </div>



      <div className="w-full px-4 py-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {shifts.map((shift) => {
            const nozzles = shift.nozzles || [1, 2, 3, 4, 5, 6];
            const members = shift.members || [];

            return (
              <div
                key={shift.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
              >
                {/* Full Content Wrapper (ensures everything stays inside) */}
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-indigo-700">{shift.name}</h2>
                    <p className="text-sm text-gray-600">{date || "Not Assigned"}</p>
                    <p className="text-sm text-indigo-500 font-medium mt-1">
                      {shift.startTime} A.M – {shift.endTime} P.M
                    </p>
                  </div>

                  {/* Supervisor & Air Boy Info */}
                  <div>
                    <div className="bg-gray-100 rounded-md px-4 py-2 flex justify-between items-center flex-wrap text-sm">
                      <div>
                        {shift.supervisor && (
                          <span className="text-gray-700 font-medium">
                            Supervisor:{" "}
                            <span className="text-blue-600 uppercase">{shift.supervisor.name}</span>
                          </span>
                        )}
                      </div>
                      <div>
                        {shift.extraOperator && (
                          <span className="text-gray-700 font-medium">
                            Extra Operator:{" "}
                            <span className="text-blue-600 uppercase">
                              {shift.extraOperator.name}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-md px-4 py-2 flex justify-between items-center flex-wrap text-sm">
                      <div> {shift.airBoy && (
                        <span className="text-gray-700 font-medium">
                          Air Boy:{" "}
                          <span className="text-green-600 uppercase">{shift.airBoy.name}</span>
                        </span>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px] table-fixed border border-gray-300 text-sm rounded-lg">
                      <thead className="bg-gray-200 text-gray-800">
                        <tr>
                          <th className="w-1/4 py-2 px-3 border">⛽ Nozzle</th>
                          <th className="w-1/2 py-2 px-3 border">👤 Member</th>
                          <th className="w-1/4 py-2 px-3 border">⏱️ Overtime</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nozzles.map((nozzle, index) => {
                          const member = members[index] || null;
                          const isOvertime =
                            member &&
                            ((shift.name === "Morning Shift" &&
                              morningOvertimeMembers.includes(member._id)) ||
                              (shift.name === "Evening Shift" &&
                                eveningOvertimeMembers.includes(member._id)));

                          return (
                            <ShiftRow
                              key={index}
                              nozzle={nozzle}
                              member={member}
                              isOvertime={isOvertime}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <BackButton previousImage="/previous.png" />
      </div>


     {/* ADD MEMBER MODAL */}
{showadd && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">

      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-700">Add Member</h2>
        <button
          onClick={() => setshowAdd(false)}
          className="text-red-500 text-xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleAddMember} className="space-y-4">

        <input
          type="text"
          placeholder="Member Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          className="border p-3 rounded-lg w-full"
        />

        <select
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          className="border p-3 rounded-lg w-full"
        >
          <option value="">Select Role</option>
          <option value="operator">Operator</option>
          <option value="supervisor">Supervisor</option>
          <option value="air boy">Air Boy</option>
        </select>

        <select
          value={newMember.shift}
          onChange={(e) => setNewMember({ ...newMember, shift: e.target.value })}
          className="border p-3 rounded-lg w-full"
        >
          <option value="">Select Shift</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>

        <select
          value={newMember.available}
          onChange={(e) => setNewMember({ ...newMember, available: e.target.value })}
          className="border p-3 rounded-lg w-full"
        >
          <option value="">Availability</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 w-full rounded-lg hover:bg-blue-700 transition shadow"
        >
          Add Member
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default ShiftManagementSystem;




// import React, { useState, useEffect } from "react";
// import { FaPlus, FaCalendarAlt } from "react-icons/fa";
// import BackButton from "../Home Page/backbutton";
// import axiosInstance from "../Dashboard/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import { IoTrashBinOutline } from "react-icons/io5";
// import { toast } from "react-toastify";

// const ShiftManagementSystem = () => {
//   const [showadd, setshowAdd] = useState(false);

//   const navigate = useNavigate();
//   const [date, setDate] = useState("");
//   const [members, setMembers] = useState([]);
//   const [absentees, setAbsentees] = useState([]);
//   const [absentMembers, setAbsentMembers] = useState([]);
//   const [morningOvertimeMembers, setMorningOvertimeMembers] = useState([]);
//   const [eveningOvertimeMembers, setEveningOvertimeMembers] = useState([]);
//   const [shifts, setShifts] = useState([
//     {
//       id: "1",
//       name: "Morning Shift",
//       startTime: "06:00",
//       endTime: "14:30",
//       members: [],
//       nozzles: [
//         "Nozzle 1",
//         "Nozzle 2",
//         "Nozzle 3",
//         "Nozzle 4",
//         "Nozzle 5",
//         "Nozzle 6",
//       ],
//     },
//     {
//       id: "2",
//       name: "Evening Shift",
//       startTime: "14:30",
//       endTime: "23:00",
//       members: [],
//       nozzles: [
//         "Nozzle 1",
//         "Nozzle 2",
//         "Nozzle 3",
//         "Nozzle 4",
//         "Nozzle 5",
//         "Nozzle 6",
//       ],
//     },
//   ]);
//   const [newMember, setNewMember] = useState({
//     name: "",
//     role: "operator",
//     shift: "",
//     available: "",
//   });

//   const handleDateChange = (event) => {
//     setDate(event.target.value);
//   };

//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const response = await axiosInstance.get("/shifting");
//         setMembers(response.data);
//         setAbsentMembers(response.data.filter((m) => m.available === "absent"));
//       } catch (error) {
//         toast.warn("Error fetching members:");
//       }
//     };
//     fetchMembers();
//   }, []);

//   const handleAddMember = async (e) => {
//     e.preventDefault();
//     if (newMember.name.trim()) {
//       try {
//         const response = await axiosInstance.post("/shifting", newMember);
//         const savedMember = response.data;
//         setMembers([...members, savedMember]);
//         setNewMember({ name: "", role: "", shift: "", available: "" });
//         setshowAdd(false);
//         toast.success("Member added");
//       } catch (error) {
//         alert("Failed to save member. Please try again.");
//       }
//     }
//   };

//   const confirmDeleteToast = (onConfirm) => {
//     toast(
//       ({ closeToast }) => (
//         <div className="flex flex-col gap-2">
//           <p>Are you sure you want to delete this ?</p>
//           <div className="flex gap-4 mt-2">
//             <button
//               onClick={() => {
//                 onConfirm();
//                 closeToast();
//               }}
//               className="bg-red-500 text-white px-3 py-1 rounded"
//             >
//               Yes
//             </button>
//             <button onClick={closeToast} className="bg-gray-300 px-3 py-1 rounded">
//               No
//             </button>
//           </div>
//         </div>
//       ),
//       {
//         position: "top-center",
//         autoClose: false,
//         closeOnClick: false,
//         closeButton: false,
//       }
//     );
//   };

//   const handleRemoveMember = async (id) => {
//     confirmDeleteToast(async () => {
//       if (!id) return;
//       try {
//         await axiosInstance.delete(`/shifting/${id}`);
//         setMembers(members.filter((m) => m._id !== id));
//         toast.success("Member deleted");
//       } catch (error) {
//         alert("Failed to delete member.");
//       }
//     });
//   };

//   const handleUpdateAvailability = async (id, status) => {
//     try {
//       await axiosInstance.put(`/shifting/${id}`, { available: status });
//       setMembers(members.map((m) => (m._id === id ? { ...m, available: status } : m)));
//       if (status === "absent") {
//         setAbsentMembers((prev) => [
//           ...prev.filter((m) => m._id !== id),
//           members.find((m) => m._id === id),
//         ]);
//       } else {
//         setAbsentMembers(absentMembers.filter((m) => m._id !== id));
//       }
//     } catch (error) {
//       toast.warn("Error updating availability:");
//     }
//   };

//   const shuffleArray = (array) => {
//     let shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       let j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   const saveAssignedShifts = async (shiftsToSave, morningOvertimeMembers, eveningOvertimeMembers) => {
//     try {
//       const shiftData = shiftsToSave.map((shift) => {
//         const nozzles = shift.nozzles || [1, 2, 3, 4, 5, 6];
//         const membersList = shift.members || [];

//         const isMorning = shift.name === "Morning Shift";
//         const overtimeList = isMorning ? morningOvertimeMembers : eveningOvertimeMembers;

//         return {
//           date: date,
//           shiftType: shift.name,
//           startTime: shift.startTime,
//           endTime: shift.endTime,
//           supervisor: shift.supervisor ? shift.supervisor.name : "Not Assigned",
//           airBoy: shift.airBoy ? shift.airBoy.name : "Not Assigned",
//           extraOperator: shift.extraOperator ? shift.extraOperator.name : "Not Assigned",
//           nozzles: nozzles.map((nozzle, index) => {
//             const assignedMember = membersList[index] || null;
//             const isOvertime = assignedMember && overtimeList.includes(assignedMember._id);

//             return {
//               nozzleNumber: `Nozzle ${index + 1}`,
//               member: assignedMember ? assignedMember.name : "Unassigned",
//               overtime: isOvertime,
//             };
//           }),
//         };
//       });

//       if (!date) {
//         toast.warning("Please select Date");
//         return;
//       }

//       await axiosInstance.post("/shiftingsavee", shiftData);
//       toast.success("Shift data saved successfully!");
//     } catch (error) {
//       toast.warn("Failed to save shift data.");
//       console.error(error);
//     }
//   };

//   const handleAssignMorningShift = () => {
//     if (members.length === 0) {
//       alert("Please add team members first");
//       return;
//     }

//     const availableMembers = members.filter(
//       (m) => m.available === "present" && !absentees.includes(m._id)
//     );

//     const morningShift = shifts.find((shift) => shift.name === "Morning Shift");

//     if (morningShift) {
//       let morningMembers = availableMembers.filter(
//         (m) => m.shift === "morning" && m.role === "operator"
//       );

//       morningMembers = shuffleArray([...morningMembers]);

//       const unassignedMorning = Math.max(0, morningShift.nozzles.length - morningMembers.length);

//       let overtimeCandidatesMorning = availableMembers.filter(
//         (m) =>
//           !morningOvertimeMembers.includes(m._id) &&
//           m.shift === "evening" &&
//           m.role === "operator"
//       );
//       overtimeCandidatesMorning = shuffleArray([...overtimeCandidatesMorning]);

//       let morningOvertime = [];
//       if (unassignedMorning > 0) {
//         morningOvertime.push(
//           ...overtimeCandidatesMorning.splice(0, Math.min(2, unassignedMorning))
//         );
//       }

//       let finalMorningOperators = shuffleArray([...morningMembers, ...morningOvertime]);

//       let extraOperator = null;
//       if (finalMorningOperators.length > morningShift.nozzles.length && morningOvertime.length === 0) {
//         extraOperator = finalMorningOperators.pop();
//       }

//       morningShift.members = finalMorningOperators;
//       setMorningOvertimeMembers(morningOvertime.map((m) => m._id));

//       morningShift.supervisor = availableMembers.find(
//         (m) => m.role === "supervisor" && m.shift === "morning"
//       );
//       morningShift.airBoy = availableMembers.find(
//         (m) => m.role === "air boy" && m.shift === "morning"
//       );

//       morningShift.extraOperator = extraOperator || null;

//       morningMembers.forEach((member) => (member.free = false));
//       setShifts([morningShift, shifts[1]]);

//       saveAssignedShifts([morningShift], morningOvertime.map((m) => m._id), eveningOvertimeMembers);
//     }
//   };

//   const handleAssignEveningShift = () => {
//     if (members.length === 0) {
//       alert("Please add team members first");
//       return;
//     }

//     const availableMembers = members.filter(
//       (m) => m.available === "present" && !absentees.includes(m._id)
//     );

//     const eveningShift = shifts.find((shift) => shift.name === "Evening Shift");

//     if (eveningShift) {
//       let eveningMembers = availableMembers.filter(
//         (m) => m.shift === "evening" && m.role === "operator"
//       );

//       eveningMembers = shuffleArray([...eveningMembers]);

//       const unassignedEvening = Math.max(0, eveningShift.nozzles.length - eveningMembers.length);

//       let overtimeCandidatesEvening = availableMembers.filter(
//         (m) =>
//           !eveningOvertimeMembers.includes(m._id) &&
//           m.shift === "morning" &&
//           m.role === "operator"
//       );
//       overtimeCandidatesEvening = shuffleArray([...overtimeCandidatesEvening]);

//       let eveningOvertime = [];
//       if (unassignedEvening > 0) {
//         eveningOvertime.push(
//           ...overtimeCandidatesEvening.splice(0, Math.min(2, unassignedEvening))
//         );
//       }

//       let finalEveningOperators = shuffleArray([...eveningMembers, ...eveningOvertime]);

//       let extraOperator = null;
//       if (finalEveningOperators.length > eveningShift.nozzles.length && eveningOvertime.length === 0) {
//         extraOperator = finalEveningOperators.pop();
//       }

//       eveningShift.members = finalEveningOperators;
//       setEveningOvertimeMembers(eveningOvertime.map((m) => m._id));

//       eveningShift.supervisor = availableMembers.find(
//         (m) => m.role === "supervisor" && m.shift === "evening"
//       );
//       eveningShift.airBoy = availableMembers.find(
//         (m) => m.role === "air boy" && m.shift === "evening"
//       );

//       eveningShift.extraOperator = extraOperator || null;

//       eveningMembers.forEach((member) => (member.free = false));
//       setShifts([shifts[0], eveningShift]);

//       const updatedEveningOvertimeMembers = eveningOvertime.map((m) => m._id);
//       saveAssignedShifts([eveningShift], morningOvertimeMembers, updatedEveningOvertimeMembers);
//     }
//   };

//   const handleRoleChange = async (id, newRole) => {
//     try {
//       await axiosInstance.put(`/shifting/${id}`, { role: newRole });
//       setMembers(members.map((m) => (m._id === id ? { ...m, role: newRole } : m)));
//     } catch (error) {
//       alert("Error updating role");
//     }
//   };

//   const handleUpdateShift = async (id, shift) => {
//     try {
//       await axiosInstance.put(`/shifting/${id}`, { shift });
//       setMembers(members.map((m) => (m._id === id ? { ...m, shift } : m)));
//     } catch (error) {
//       alert("Error updating shift:", error);
//     }
//   };

//   const ShiftRow = ({ nozzle, member, isOvertime }) => (
//     <tr className="hover:bg-slate-50 transition">
//       <td className="py-3 px-4 border-t text-center">{nozzle}</td>
//       <td className="py-3 px-4 border-t text-center">
//         {member?.name ? (
//           <span className="font-medium text-slate-700">{member.name}</span>
//         ) : (
//           <span className="text-gray-400 italic">Unassigned</span>
//         )}
//       </td>
//       <td className="py-3 px-4 border-t text-center">
//         <span
//           className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
//             isOvertime ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//           }`}
//         >
//           {isOvertime ? "Overtime" : "Regular"}
//         </span>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500">
//               Shift Management
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Clean, responsive dashboard to manage shift assignments and members.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="hidden sm:flex items-center bg-white shadow-sm rounded-lg px-3 py-2 gap-2">
//               <FaCalendarAlt className="text-slate-400" />
//               <input
//                 type="date"
//                 value={date}
//                 onChange={handleDateChange}
//                 className="text-sm outline-none"
//               />
//             </div>

//             <button
//               onClick={() => setshowAdd(true)}
//               className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5"
//             >
//               <FaPlus />
//               <span className="hidden sm:inline">Add Member</span>
//             </button>
//           </div>
//         </div>

//         {/* Grid: Left - Members, Right - Actions & Summary */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Members Card */}
//           <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-slate-700">Members</h2>
//               <div className="text-sm text-gray-500">
//                 <span className="font-medium text-green-600 mr-3">
//                   ✅ {members.filter((m) => m.available === "present").length}
//                 </span>
//                 <span className="font-medium text-red-600">
//                   ❌ {members.filter((m) => m.available === "absent").length}
//                 </span>
//               </div>
//             </div>

//             <div className="overflow-x-auto rounded-lg border border-slate-100">
//               <table className="w-full text-sm table-fixed">
//                 <thead className="bg-slate-50 sticky top-0">
//                   <tr>
//                     <th className="p-3 text-left w-[5%]">#</th>
//                     <th className="p-3 text-left w-[30%]">Name</th>
//                     <th className="p-3 text-left w-[20%]">Role</th>
//                     <th className="p-3 text-left w-[20%]">Availability</th>
//                     <th className="p-3 text-left w-[15%]">Shift</th>
//                     <th className="p-3 text-center w-[10%]">Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {members.map((member, index) => (
//                     <tr
//                       key={member._id}
//                       className="even:bg-white odd:bg-slate-50 hover:bg-slate-100 transition"
//                     >
//                       <td className="p-3 font-medium">{index + 1}</td>
//                       <td className="p-3 font-medium text-slate-700">{member.name?.toUpperCase()}</td>
//                       <td className="p-3">
//                         <select
//                           value={member.role}
//                           onChange={(e) => handleRoleChange(member._id, e.target.value)}
//                           className="border rounded px-2 py-1 w-full text-sm"
//                         >
//                           <option value="operator">Operator</option>
//                           <option value="supervisor">Supervisor</option>
//                           <option value="air boy">Air Boy</option>
//                         </select>
//                       </td>
//                       <td className="p-3">
//                         <label className="relative inline-flex items-center cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={member.available === "present"}
//                             onChange={() =>
//                               handleUpdateAvailability(
//                                 member._id,
//                                 member.available === "present" ? "absent" : "present",
//                                 null
//                               )
//                             }
//                             className="sr-only peer"
//                           />
//                           <div className="w-14 h-7 bg-gray-200 peer-checked:bg-emerald-400 rounded-full p-1 transition-all">
//                             <div
//                               className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 flex items-center justify-center text-xs font-bold ${
//                                 member.available === "present" ? "translate-x-7 text-emerald-600" : "translate-x-0 text-gray-600"
//                               }`}
//                             >
//                               {member.available === "present" ? "P" : "A"}
//                             </div>
//                           </div>
//                         </label>
//                       </td>
//                       <td className="p-3">
//                         <select
//                           value={member.shift}
//                           onChange={(e) => handleUpdateShift(member._id, e.target.value)}
//                           className="border rounded px-2 py-1 w-full text-sm"
//                         >
//                           <option value="morning">Morning</option>
//                           <option value="evening">Evening</option>
//                         </select>
//                       </td>
//                       <td className="p-3 text-center">
//                         <div
//                           onClick={() => handleRemoveMember(member._id)}
//                           className="inline-flex items-center justify-center w-9 h-9 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
//                           title="Delete member"
//                         >
//                           <IoTrashBinOutline className="text-lg" />
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Right column: Actions */}
//           <div className="space-y-4">
//             <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3">
//               <h3 className="text-md font-semibold text-slate-700">Quick Actions</h3>
//               <div className="flex flex-col gap-3">
//                 <button
//                   onClick={handleAssignMorningShift}
//                   className="w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow-sm transition"
//                 >
//                   Assign Morning Shift
//                 </button>
//                 <button
//                   onClick={handleAssignEveningShift}
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow-sm transition"
//                 >
//                   Assign Evening Shift
//                 </button>
//                 <div
//                   onClick={() => navigate("/allshifting")}
//                   className="cursor-pointer w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md shadow-sm transition"
//                 >
//                   View All Shifts
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-md p-4">
//               <h3 className="text-md font-semibold text-slate-700 mb-2">Date</h3>
//               <div className="flex items-center gap-2">
//                 <FaCalendarAlt className="text-slate-400" />
//                 <input
//                   type="date"
//                   value={date}
//                   onChange={handleDateChange}
//                   className="w-full text-sm outline-none"
//                 />
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-md p-4">
//               <h3 className="text-md font-semibold text-slate-700 mb-2">Summary</h3>
//               <div className="flex flex-col gap-2 text-sm">
//                 <div className="flex items-center justify-between">
//                   <span>Present</span>
//                   <span className="font-semibold text-emerald-600">{members.filter((m) => m.available === "present").length}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span>Absent</span>
//                   <span className="font-semibold text-red-600">{members.filter((m) => m.available === "absent").length}</span>
//                 </div>
//                 <div className="mt-2 text-xs text-gray-500">Tip: Toggle availability to control assignment candidates.</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Shifts Preview */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold text-slate-700 mb-4">Shift Overview</h2>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {shifts.map((shift) => {
//               const nozzles = shift.nozzles || [1, 2, 3, 4, 5, 6];
//               const membersList = shift.members || [];

//               return (
//                 <div key={shift.id} className="bg-white rounded-2xl shadow-md p-5">
//                   <div className="flex items-center justify-between mb-3">
//                     <div>
//                       <h3 className="text-lg font-bold text-indigo-600">{shift.name}</h3>
//                       <p className="text-sm text-gray-500">{date || "Not Assigned"}</p>
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       {shift.startTime} - {shift.endTime}
//                     </div>
//                   </div>

//                   <div className="flex gap-3 flex-wrap mb-3">
//                     {shift.supervisor && (
//                       <div className="px-3 py-1 bg-slate-50 rounded-full text-sm text-slate-700">Supervisor: <span className="font-semibold ml-1 text-indigo-600 uppercase">{shift.supervisor.name}</span></div>
//                     )}
//                     {shift.airBoy && (
//                       <div className="px-3 py-1 bg-slate-50 rounded-full text-sm text-slate-700">Air Boy: <span className="font-semibold ml-1 text-emerald-600 uppercase">{shift.airBoy.name}</span></div>
//                     )}
//                     {shift.extraOperator && (
//                       <div className="px-3 py-1 bg-slate-50 rounded-full text-sm text-slate-700">Extra: <span className="font-semibold ml-1 text-indigo-600 uppercase">{shift.extraOperator.name}</span></div>
//                     )}
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-50">
//                         <tr>
//                           <th className="py-2 px-3 text-left">Nozzle</th>
//                           <th className="py-2 px-3 text-left">Member</th>
//                           <th className="py-2 px-3 text-left">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {nozzles.map((nozzle, index) => {
//                           const member = membersList[index] || null;
//                           const isOvertime =
//                             member &&
//                             ((shift.name === "Morning Shift" &&
//                               morningOvertimeMembers.includes(member._id)) ||
//                               (shift.name === "Evening Shift" &&
//                                 eveningOvertimeMembers.includes(member._id)));

//                           return (
//                             <ShiftRow key={index} nozzle={nozzle} member={member} isOvertime={isOvertime} />
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="mt-8">
//           <BackButton previousImage="/previous.png" />
//         </div>
//       </div>

//       {/* ADD MEMBER MODAL */}
//       {showadd && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setshowAdd(false)}></div>

//           <div className="relative w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-indigo-700">Add Member</h2>
//               <button onClick={() => setshowAdd(false)} className="text-slate-500 text-xl font-bold">✕</button>
//             </div>

//             <form onSubmit={handleAddMember} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Member Name"
//                 value={newMember.name}
//                 onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
//                 className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//               />

//               <select
//                 value={newMember.role}
//                 onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
//                 className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//               >
//                 <option value="">Select Role</option>
//                 <option value="operator">Operator</option>
//                 <option value="supervisor">Supervisor</option>
//                 <option value="air boy">Air Boy</option>
//               </select>

//               <select
//                 value={newMember.shift}
//                 onChange={(e) => setNewMember({ ...newMember, shift: e.target.value })}
//                 className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//               >
//                 <option value="">Select Shift</option>
//                 <option value="morning">Morning</option>
//                 <option value="evening">Evening</option>
//               </select>

//               <select
//                 value={newMember.available}
//                 onChange={(e) => setNewMember({ ...newMember, available: e.target.value })}
//                 className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//               >
//                 <option value="">Availability</option>
//                 <option value="present">Present</option>
//                 <option value="absent">Absent</option>
//               </select>

//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
//                 >
//                   Add Member
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setshowAdd(false)}
//                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-2 rounded-lg transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShiftManagementSystem;
