import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../Dashboard/axiosInstance';


export const ShiftContext = createContext();

export const ShiftProvider = ({ children }) => {
  const [morningOvertimeMembers, setMorningOvertimeMembers] = useState([]);
  const [eveningOvertimeMembers, setEveningOvertimeMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [absentMembers, setAbsentMembers] = useState([]);
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

  const [date, setDate] = useState('');

  useEffect(() => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
  }, []);


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

      morningMembers.forEach(member => member.free = false);
      setShifts(prevShifts => prevShifts.map(shift => {
        if (shift.name === "Morning Shift") {
            return { ...shift, members: morningMembers };
        } else if (shift.name === "Evening Shift") {
            return { ...shift, members: eveningMembers };
        }
        return shift;
    }));
    }

  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  return (
    <ShiftContext.Provider value={{ shifts, handleAssignShiftsAndOvertime }}>
      {children}
    </ShiftContext.Provider>
  );
};

