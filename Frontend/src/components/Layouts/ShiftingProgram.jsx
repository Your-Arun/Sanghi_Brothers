import React, { useState } from 'react';
import { Menu, Users, FileText, Share2, Calendar } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// --- Mock Data (Aapka staff list yahan aayega) ---
const initialStaff = [
  { id: '1', name: 'Raju', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Amit', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Sonu', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Vikram', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Rahul', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'Deepak', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', name: 'Ajay', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: '8', name: 'Suresh', avatar: 'https://i.pravatar.cc/150?u=8' },
];

// Nozzle Configuration
const nozzles = [
  { id: 'N2', label: 'Nozzle 2' }, // Top Left
  { id: 'N1', label: 'Nozzle 1' }, // Top Right
  { id: 'N3', label: 'Nozzle 3' }, // Bottom Left
  { id: 'N4', label: 'Nozzle 4' }, // Bottom Right
];

const hangingNozzles = [
  { id: 'N5', label: 'Nozzle 5' },
  { id: 'N6', label: 'Nozzle 6' },
];

// --- 1. Draggable Component (Staff Photo) ---
const DraggableStaff = ({ id, staffMember, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { staffMember },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging || isOverlay ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center justify-center touch-none ${
        isOverlay ? 'scale-110 opacity-90' : ''
      }`}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 bg-white shadow-md">
        <img
          src={staffMember.avatar}
          alt={staffMember.name}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
      <span className="text-[10px] font-bold text-gray-800 mt-1 bg-white/80 px-1 rounded shadow-sm">
        {staffMember.name}
      </span>
    </div>
  );
};

// --- 2. Droppable Zone (Nozzles & Absent Box) ---
const DroppableZone = ({ id, children, className, label }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-colors duration-200 ${className} ${
        isOver ? 'bg-green-100 ring-2 ring-green-500' : ''
      }`}
    >
      {/* Label Badge */}
      {label && (
        <span className="absolute -top-2 left-2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded z-0">
          {label}
        </span>
      )}
      {children}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ShiftManagerUI() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shift, setShift] = useState('Morning');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Assignments State: { 'N1': staffObj, 'N2': null, 'absent': [staffObj] }
  const [assignments, setAssignments] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [activeStaff, setActiveStaff] = useState(null);

  // Mobile Touch & Mouse Sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  // Calculate Available Staff
  const assignedIds = Object.values(assignments)
    .flat()
    .map((s) => s?.id)
    .filter(Boolean);
    
  const availableStaff = initialStaff.filter((s) => !assignedIds.includes(s.id));
  const absentStaff = assignments['absent'] || [];

  // --- Drag Start ---
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    // Find the staff being dragged (either from list, nozzle, or absent)
    let staff = initialStaff.find((s) => s.id === active.id);
    setActiveStaff(staff);
  };

  // --- Drag End (The Logic) ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveStaff(null);

    if (!over) return; // Dropped nowhere

    const staffId = active.id;
    const targetZone = over.id; // e.g., 'N1', 'N2', 'absent'

    // Get full staff details
    const draggedStaff = initialStaff.find((s) => s.id === staffId);

    setAssignments((prev) => {
      const newAssignments = { ...prev };

      // 1. Remove from old location (clean up previous spot)
      Object.keys(newAssignments).forEach((key) => {
        if (key === 'absent') {
          // Remove from absent array
          if (newAssignments[key]) {
            newAssignments[key] = newAssignments[key].filter((s) => s.id !== staffId);
          }
        } else if (newAssignments[key]?.id === staffId) {
          // Remove from nozzle
          newAssignments[key] = null;
        }
      });

      // 2. Add to new location
      if (targetZone === 'absent') {
        const currentAbsent = newAssignments['absent'] || [];
        newAssignments['absent'] = [...currentAbsent, draggedStaff];
      } else {
        // Assign to Nozzle (Overwrite functionality)
        newAssignments[targetZone] = draggedStaff;
      }

      return newAssignments;
    });
  };

  // --- WhatsApp Submit ---
  const handleSubmit = () => {
    let message = `*⛽ Petrol Pump Shift Report*\n`;
    message += `📅 Date: ${date}\n🕒 Shift: ${shift}\n\n`;

    message += `*--- Assignments ---*\n`;
    [...nozzles, ...hangingNozzles].forEach((n) => {
      const staff = assignments[n.id];
      message += `${n.label}: ${staff ? staff.name : '❌ Empty'}\n`;
    });

    const absentNames = assignments['absent']?.map((s) => s.name).join(', ');
    if (absentNames) {
      message += `\n⚠️ *Absent:* ${absentNames}`;
    }

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans overflow-hidden text-gray-900">
      
      {/* 1. TOP NAVBAR */}
      <header className="bg-blue-800 text-white p-4 flex justify-between items-center shadow-md shrink-0 z-30">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={28} />
        </button>
        <h1 className="text-lg font-bold tracking-wide">Shift Manager</h1>
        <div className="w-8"></div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="bg-white w-64 h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-200">
            <h2 className="text-2xl font-bold text-blue-800 border-b pb-2">Menu</h2>
            <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium text-lg">
              <Users size={24} /> Add Member
            </button>
            <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium text-lg">
              <FileText size={24} /> Member List
            </button>
            <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium text-lg">
              <Calendar size={24} /> All Shift Reports
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="mt-auto text-red-500 font-bold text-lg"
            >
              Close Menu
            </button>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* SHIFT & DATE SELECTOR */}
      <div className="p-3 bg-white shadow-sm flex flex-col gap-2 shrink-0 z-20">
        <div className="flex bg-gray-200 rounded-lg p-1">
          {['Morning', 'Evening', 'Night'].map((s) => (
            <button
              key={s}
              onClick={() => setShift(s)}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                shift === s ? 'bg-blue-600 text-white shadow' : 'text-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 text-sm w-full bg-gray-50 font-medium"
        />
      </div>

      {/* MAIN DRAG & DROP AREA */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 p-2 overflow-y-auto flex flex-col items-center gap-4 mt-2 pb-32">
          
          {/* PUMP CONTAINER */}
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 border border-gray-200 relative">
            <h3 className="text-center text-gray-400 text-xs mb-4 uppercase tracking-widest font-bold">
              Pump Island Layout
            </h3>

            <div className="flex w-full min-h-[280px]">
              {/* GRID for Main Nozzles & MPD */}
              <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-12 relative pr-3 border-r-2 border-dashed border-gray-300">
                
                {/* Nozzle 2 (Top Left) */}
                <DroppableZone
                  id="N2"
                  label="2"
                  className="bg-gray-50 rounded-lg border-2 border-gray-300 flex items-center justify-center h-24"
                >
                  {assignments['N2'] && <DraggableStaff id={assignments['N2'].id} staffMember={assignments['N2']} />}
                </DroppableZone>

                {/* Nozzle 1 (Top Right) */}
                <DroppableZone
                  id="N1"
                  label="1"
                  className="bg-gray-50 rounded-lg border-2 border-gray-300 flex items-center justify-center h-24"
                >
                  {assignments['N1'] && <DraggableStaff id={assignments['N1'].id} staffMember={assignments['N1']} />}
                </DroppableZone>

                {/* CENTER MPD BLOCK (Absolute Positioned) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-28 bg-gray-800 rounded-lg shadow-2xl flex flex-col items-center justify-center text-yellow-400 font-bold z-10 border-2 border-gray-600">
                  <span className="text-2xl">MPD</span>
                  <span className="text-[10px] text-gray-400 mt-1">CENTER</span>
                </div>

                {/* Nozzle 3 (Bottom Left) */}
                <DroppableZone
                  id="N3"
                  label="3"
                  className="bg-gray-50 rounded-lg border-2 border-gray-300 flex items-center justify-center h-24"
                >
                  {assignments['N3'] && <DraggableStaff id={assignments['N3'].id} staffMember={assignments['N3']} />}
                </DroppableZone>

                {/* Nozzle 4 (Bottom Right) */}
                <DroppableZone
                  id="N4"
                  label="4"
                  className="bg-gray-50 rounded-lg border-2 border-gray-300 flex items-center justify-center h-24"
                >
                  {assignments['N4'] && <DraggableStaff id={assignments['N4'].id} staffMember={assignments['N4']} />}
                </DroppableZone>
              </div>

              {/* RIGHT SIDE: Hanging Nozzles */}
              <div className="w-20 pl-3 flex flex-col justify-between py-1">
                <DroppableZone
                  id="N5"
                  label="5"
                  className="flex-1 bg-blue-50 rounded-lg border-2 border-blue-200 flex items-center justify-center mb-3"
                >
                  {assignments['N5'] && <DraggableStaff id={assignments['N5'].id} staffMember={assignments['N5']} />}
                </DroppableZone>
                <DroppableZone
                  id="N6"
                  label="6"
                  className="flex-1 bg-blue-50 rounded-lg border-2 border-blue-200 flex items-center justify-center"
                >
                  {assignments['N6'] && <DraggableStaff id={assignments['N6'].id} staffMember={assignments['N6']} />}
                </DroppableZone>
              </div>
            </div>
          </div>

          {/* ABSENT ZONE */}
          <div className="w-full max-w-md">
             <div className="text-xs font-bold text-red-400 uppercase mb-1 pl-1">Absent Staff</div>
             <DroppableZone
              id="absent"
              className="w-full bg-red-50 border-2 border-dashed border-red-300 rounded-lg p-2 min-h-[80px] flex flex-wrap gap-2 items-center"
            >
              {absentStaff.length === 0 && (
                <span className="text-red-300 text-xs w-full text-center">Drop Absent Staff Here</span>
              )}
              {absentStaff.map((s) => (
                <DraggableStaff key={s.id} id={s.id} staffMember={s} />
              ))}
            </DroppableZone>
          </div>
         
        </div>

        {/* BOTTOM FIXED AREA: Present List & Submit */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] border-t rounded-t-2xl z-40 flex flex-col">
          
          {/* Present Staff List (Horizontal Scroll) */}
          <div className="pt-3 pb-2 px-4 border-b">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Available Staff (Drag to assign)</p>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {availableStaff.map((staff) => (
                <DraggableStaff key={staff.id} id={staff.id} staffMember={staff} />
              ))}
              {availableStaff.length === 0 && (
                <span className="text-gray-400 text-sm italic w-full text-center">All staff assigned ✅</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-4 bg-gray-50">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 active:scale-95 transition-transform text-white font-bold py-3 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <Share2 size={20} /> Submit to WhatsApp
            </button>
          </div>
        </div>

        {/* DRAG OVERLAY (Visual feedback when moving item) */}
        <DragOverlay>
          {activeStaff ? <DraggableStaff id={activeStaff.id} staffMember={activeStaff} isOverlay /> : null}
        </DragOverlay>

      </DndContext>
    </div>
  );
}