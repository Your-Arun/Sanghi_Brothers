import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ShiftContext = createContext();

export const ShiftProvider = ({ children }) => {
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
  const [morningOvertimeMembers, setMorningOvertimeMembers] = useState([]);
  const [eveningOvertimeMembers, setEveningOvertimeMembers] = useState([]);

  const handleAssignShiftsAndOvertime = (availableMembers) => {
    if (availableMembers.length === 0) {
      alert("Please add team members first");
      return;
    }

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

      setShifts([morningShift, eveningShift]);
    }
  };

  return (
    <ShiftContext.Provider value={{ shifts, handleAssignShiftsAndOvertime }}>
      {children}
    </ShiftContext.Provider>
  );
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};