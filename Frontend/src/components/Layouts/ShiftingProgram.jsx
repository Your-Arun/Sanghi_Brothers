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

// --- Mock Data ---
const initialStaff = [
  { id: '1', name: 'Raju', avatar: 'https://i.pravatar.cc/300?u=1' },
  { id: '2', name: 'Amit', avatar: 'https://i.pravatar.cc/300?u=2' },
  { id: '3', name: 'Sonu', avatar: 'https://i.pravatar.cc/300?u=3' },
  { id: '4', name: 'Vikram', avatar: 'https://i.pravatar.cc/300?u=4' },
  { id: '5', name: 'Rahul', avatar: 'https://i.pravatar.cc/300?u=5' },
  { id: '6', name: 'Deepak', avatar: 'https://i.pravatar.cc/300?u=6' },
  { id: '7', name: 'Ajay', avatar: 'https://i.pravatar.cc/300?u=7' },
  { id: '8', name: 'Suresh', avatar: 'https://i.pravatar.cc/300?u=8' },
];

// Nozzle Configuration
const nozzles = [
  { id: 'N2', label: 'Nozzle 2' },
  { id: 'N1', label: 'Nozzle 1' },
  { id: 'N3', label: 'Nozzle 3' },
  { id: 'N4', label: 'Nozzle 4' },
];

const hangingNozzles = [
  { id: 'N5', label: 'Hanging 5' },
  { id: 'N6', label: 'Hanging 6' },
];

// --- 1. Draggable Component (BIGGER & BOLDER) ---
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
      className={`flex flex-col items-center justify-center touch-none transition-transform ${
        isOverlay ? 'scale-110 opacity-95' : ''
      }`}
    >
      {/* BIGGER IMAGE SIZE (w-20 h-20) */}
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
        <img
          src={staffMember.avatar}
          alt={staffMember.name}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
      <span className="text-xs font-black text-gray-900 mt-[-10px] bg-white px-3 py-1 rounded-full shadow-md border border-gray-200 z-10 uppercase tracking-wider">
        {staffMember.name}
      </span>
    </div>
  );
};

// --- 2. Droppable Zone (Stronger Borders) ---
const DroppableZone = ({ id, children, className, label, isAbsent = false }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all duration-200 ${className} ${
        isOver 
          ? (isAbsent ? 'bg-red-100 border-red-500 scale-105' : 'bg-green-100 border-green-600 scale-105 shadow-xl') 
          : ''
      }`}
    >
      {/* Label Badge */}
      {label && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm z-20 whitespace-nowrap">
          {label}
        </div>
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
  const [assignments, setAssignments] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [activeStaff, setActiveStaff] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  // Logic to calculate available staff
  const assignedIds = Object.values(assignments).flat().map((s) => s?.id).filter(Boolean);
  const availableStaff = initialStaff.filter((s) => !assignedIds.includes(s.id));
  const absentStaff = assignments['absent'] || [];

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    let staff = initialStaff.find((s) => s.id === active.id);
    setActiveStaff(staff);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveStaff(null);

    if (!over) return;

    const staffId = active.id;
    const targetZone = over.id;
    const draggedStaff = initialStaff.find((s) => s.id === staffId);

    setAssignments((prev) => {
      const newAssignments = { ...prev };

      // Remove from old location
      Object.keys(newAssignments).forEach((key) => {
        if (key === 'absent') {
          if (newAssignments[key]) newAssignments[key] = newAssignments[key].filter((s) => s.id !== staffId);
        } else if (newAssignments[key]?.id === staffId) {
          newAssignments[key] = null;
        }
      });

      // Add to new location
      if (targetZone === 'absent') {
        const currentAbsent = newAssignments['absent'] || [];
        newAssignments['absent'] = [...currentAbsent, draggedStaff];
      } else {
        newAssignments[targetZone] = draggedStaff;
      }
      return newAssignments;
    });
  };

  const handleSubmit = () => {
    let message = `*⛽ Petrol Pump Shift Report*\n📅 Date: ${date}\n🕒 Shift: ${shift}\n\n*Assignments:*\n`;
    [...nozzles, ...hangingNozzles].forEach((n) => {
      const staff = assignments[n.id];
      message += `${n.label}: ${staff ? staff.name : '❌ Empty'}\n`;
    });
    const absentNames = assignments['absent']?.map((s) => s.name).join(', ');
    if (absentNames) message += `\n⚠️ *Absent:* ${absentNames}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden text-gray-900">
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg shrink-0 z-30">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={28} />
        </button>
        <h1 className="text-xl font-black tracking-wider uppercase">Pump Manager</h1>
        <div className="w-8"></div>
      </header>

      {/* SIDEBAR */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-left">
            <h2 className="text-2xl font-black text-slate-800 border-b-4 border-slate-800 pb-2">MENU</h2>
            <button className="flex items-center gap-4 text-lg font-bold text-gray-700"><Users /> Add Member</button>
            <button className="flex items-center gap-4 text-lg font-bold text-gray-700"><FileText /> Member List</button>
            <button className="flex items-center gap-4 text-lg font-bold text-gray-700"><Calendar /> All Reports</button>
            <button onClick={() => setIsSidebarOpen(false)} className="mt-auto text-red-600 font-black text-xl uppercase">Close X</button>
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* SHIFT & DATE */}
      <div className="p-4 bg-white shadow-md z-20">
        <div className="flex bg-gray-200 rounded-xl p-1.5 mb-3">
          {/* Removed NIGHT shift here */}
          {['Morning', 'Evening'].map((s) => (
            <button
              key={s}
              onClick={() => setShift(s)}
              className={`flex-1 py-3 rounded-lg text-sm font-black uppercase tracking-wide transition-all ${
                shift === s ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s} Shift
            </button>
          ))}
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-slate-700 font-bold outline-none focus:border-blue-500"
        />
      </div>

      {/* MAIN SCROLLABLE AREA */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-y-auto bg-slate-100">
          {/* Added pb-80 to fix scrolling issue */}
          <div className="flex flex-col items-center p-4 gap-6 pb-80">
            
            {/* PUMP ISLAND CARD */}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-5 relative mt-2">
              <h3 className="text-center text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-6">Filling Station Layout</h3>

              <div className="flex w-full">
                {/* LEFT: 4 Nozzles + MPD */}
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-10 relative pr-4 border-r-4 border-dashed border-slate-300">
                  
                  {/* Corners */}
                  <DroppableZone id="N2" label="Nozzle 2 (TL)" className="bg-blue-50 h-28 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                    {assignments['N2'] && <DraggableStaff id={assignments['N2'].id} staffMember={assignments['N2']} />}
                  </DroppableZone>

                  <DroppableZone id="N1" label="Nozzle 1 (TR)" className="bg-blue-50 h-28 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                    {assignments['N1'] && <DraggableStaff id={assignments['N1'].id} staffMember={assignments['N1']} />}
                  </DroppableZone>

                  {/* MPD Center - Bold Digital Look */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-32 bg-gray-900 rounded-lg shadow-2xl flex flex-col items-center justify-center border-4 border-gray-700 z-10">
                    <span className="text-3xl font-mono text-yellow-400 font-bold animate-pulse">0.00</span>
                    <span className="text-[10px] text-gray-400 font-bold tracking-widest mt-1">MPD-1</span>
                  </div>

                  <DroppableZone id="N3" label="Nozzle 3 (BL)" className="bg-blue-50 h-28 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                    {assignments['N3'] && <DraggableStaff id={assignments['N3'].id} staffMember={assignments['N3']} />}
                  </DroppableZone>

                  <DroppableZone id="N4" label="Nozzle 4 (BR)" className="bg-blue-50 h-28 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                    {assignments['N4'] && <DraggableStaff id={assignments['N4'].id} staffMember={assignments['N4']} />}
                  </DroppableZone>
                </div>

                {/* RIGHT: Hanging */}
                <div className="w-24 pl-4 flex flex-col gap-4 justify-center">
                   <DroppableZone id="N5" label="Hang 5" className="flex-1 bg-indigo-50 rounded-xl border-4 border-indigo-200 flex items-center justify-center">
                    {assignments['N5'] && <DraggableStaff id={assignments['N5'].id} staffMember={assignments['N5']} />}
                  </DroppableZone>
                   <DroppableZone id="N6" label="Hang 6" className="flex-1 bg-indigo-50 rounded-xl border-4 border-indigo-200 flex items-center justify-center">
                    {assignments['N6'] && <DraggableStaff id={assignments['N6'].id} staffMember={assignments['N6']} />}
                  </DroppableZone>
                </div>
              </div>
            </div>

            {/* ABSENT SECTION (Fixed Visibility) */}
            <div className="w-full max-w-lg mt-2">
               <div className="text-sm font-black text-red-500 uppercase mb-2 ml-1">Absent Staff Zone</div>
               <DroppableZone 
                id="absent" 
                isAbsent={true}
                className="w-full bg-red-50 border-4 border-dashed border-red-300 rounded-2xl p-4 min-h-[120px] flex flex-wrap gap-4 items-center justify-center"
              >
                {absentStaff.length === 0 && (
                  <span className="text-red-300 font-bold uppercase text-xs">Drop absent members here</span>
                )}
                {absentStaff.map((s) => (
                  <DraggableStaff key={s.id} id={s.id} staffMember={s} />
                ))}
              </DroppableZone>
            </div>

          </div>
        </div>

        {/* BOTTOM DOCK (Present List + Submit) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.1)] border-t-2 border-gray-100 rounded-t-3xl z-40 flex flex-col">
          
          {/* List Header */}
          <div className="pt-4 px-6">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Available Staff</p>
          </div>

          {/* Horizontal Scroll List */}
          <div className="flex gap-4 overflow-x-auto px-6 py-4 scrollbar-hide">
            {availableStaff.map((staff) => (
              <div key={staff.id} className="shrink-0">
                <DraggableStaff id={staff.id} staffMember={staff} />
              </div>
            ))}
            {availableStaff.length === 0 && (
              <div className="w-full text-center py-4 text-gray-400 font-medium italic bg-gray-50 rounded-xl">
                All staff assigned!
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-lg py-4 rounded-2xl shadow-green-200 shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Share2 size={24} strokeWidth={3} /> 
              SUBMIT REPORT
            </button>
          </div>
        </div>

        <DragOverlay>
          {activeStaff ? <DraggableStaff id={activeStaff.id} staffMember={activeStaff} isOverlay /> : null}
        </DragOverlay>

      </DndContext>
    </div>
  );
}