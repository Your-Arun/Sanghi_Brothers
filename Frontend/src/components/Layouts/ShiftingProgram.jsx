import React, { useState, useEffect } from 'react';
import { 
  Menu, Users, FileText, Share2, Calendar, Plus, Trash2, RefreshCw 
} from 'lucide-react';
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
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Dashboard/axiosInstance'; 

// --- 1. Draggable Staff Card (SCROLL FIX APPLIED) ---
const DraggableStaff = ({ id, staffMember, isOverlay = false, size = "normal" }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { staffMember },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging || isOverlay ? 999 : 1,
  };

  const isSmall = size === "small";
  const imgSize = isSmall ? "w-12 h-12" : "w-20 h-20"; 
  const textSize = isSmall ? "text-[10px]" : "text-xs";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      // CHANGE: 'touch-none' removed, replaced with 'touch-manipulation'
      // This allows scrolling when swiping over the image
      className={`flex flex-col items-center justify-center touch-manipulation transition-transform ${
        isOverlay ? 'scale-110 opacity-95 cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <div className={`${imgSize} rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200`}>
        <img
          src={staffMember.avatar || `https://ui-avatars.com/api/?name=${staffMember.name}&background=random`}
          alt={staffMember.name}
          className="w-full h-full object-cover pointer-events-none select-none" // Added select-none
        />
      </div>
      <span className={`${textSize} font-black text-gray-900 mt-[-8px] bg-white px-2 py-0.5 rounded-full shadow-md border border-gray-200 z-10 uppercase tracking-wider whitespace-nowrap`}>
        {staffMember.name}
      </span>
    </div>
  );
};

// --- 2. Droppable Zone ---
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
      {label && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-20 whitespace-nowrap">
          {label}
        </div>
      )}
      {children}
    </div>
  );
};

// --- MAIN COMPONENT ---
const ShiftManagementSystem = () => {
  const navigate = useNavigate();
  
  // -- UI State --
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMemberListModal, setShowMemberListModal] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeStaff, setActiveStaff] = useState(null);

  // -- Data State --
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('Morning');
  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState({});
  
  const [newMember, setNewMember] = useState({
    name: "", role: "operator", shift: 'morning', available: 'present', image: null
  });

  // -- SENSORS TUNING FOR MOBILE --
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { 
      activationConstraint: { 
        delay: 250, // Press and hold for 250ms to drag
        tolerance: 5 // If moved > 5px before 250ms, it becomes a scroll
      } 
    })
  );

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get("/shifting");
        const formattedMembers = response.data.map(m => ({
          ...m, id: m._id, avatar: m.avatar || null 
        }));
        setMembers(formattedMembers);
        const absents = formattedMembers.filter(m => m.available === 'absent');
        setAssignments(prev => ({ ...prev, absent: absents }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchMembers();
  }, []);

  const assignedIds = Object.values(assignments).flat().map((s) => s?.id).filter(Boolean);
  const availableStaff = members.filter((s) => s.available === 'present' && !assignedIds.includes(s.id));
  const absentStaff = assignments['absent'] || [];

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    let staff = members.find((s) => s.id === active.id);
    setActiveStaff(staff);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveStaff(null);
    if (!over) return;

    const staffId = active.id;
    const targetZone = over.id;
    const draggedStaff = members.find((s) => s.id === staffId);

    setAssignments((prev) => {
      const newAssignments = { ...prev };
      Object.keys(newAssignments).forEach((key) => {
        if (key === 'absent') {
          if (newAssignments[key]) newAssignments[key] = newAssignments[key].filter((s) => s.id !== staffId);
        } else if (newAssignments[key]?.id === staffId) {
          newAssignments[key] = null;
        }
      });

      if (targetZone === 'absent') {
        const currentAbsent = newAssignments['absent'] || [];
        newAssignments['absent'] = [...currentAbsent, draggedStaff];
      } else if (targetZone.startsWith('N')) {
        newAssignments[targetZone] = draggedStaff;
      }
      return newAssignments;
    });
  };

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAutoAssign = () => {
    const availableForShift = members.filter((m) => m.available === "present" && !assignedIds.includes(m.id));
    let operators = availableForShift.filter(m => m.shift.toLowerCase() === shift.toLowerCase() && m.role === 'operator');
    operators = shuffleArray(operators);
    const newAssigns = { ...assignments };
    ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'].forEach((nid, index) => {
        if (operators[index]) newAssigns[nid] = operators[index];
    });
    setAssignments(newAssigns);
    toast.success(`Auto-assigned ${shift} Shift!`);
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!newMember.name) return;
    try {
      const response = await axiosInstance.post("/shifting", newMember);
      const saved = { ...response.data, id: response.data._id, avatar: newMember.image };
      setMembers([...members, saved]);
      setNewMember({ name: "", role: "operator", shift: "morning", available: "present", image: null });
      setShowAddModal(false);
      toast.success("Member Added");
    } catch (error) {
      toast.error("Failed");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setNewMember({ ...newMember, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleDeleteMember = async (id) => {
    if(window.confirm("Delete?")){
        try {
            await axiosInstance.delete(`/shifting/${id}`);
            setMembers(members.filter(m => m.id !== id));
            toast.success("Deleted");
        } catch (err) { toast.error("Failed"); }
    }
  };

  const handleSubmitReport = () => {
    let message = `*⛽ Petrol Pump Shift Report*\n📅 Date: ${date}\n🕒 Shift: ${shift}\n\n*Assignments:*\n`;
    const mapLabels = { 'N1': 'Nozzle 1 (TR)', 'N2': 'Nozzle 2 (TL)', 'N3': 'Nozzle 3 (BL)', 'N4': 'Nozzle 4 (BR)', 'N5': 'Hanging 5', 'N6': 'Hanging 6' };
    Object.entries(mapLabels).forEach(([key, label]) => {
      const staff = assignments[key];
      message += `${label}: ${staff ? staff.name : '❌ Empty'}\n`;
    });
    const absentNames = assignments['absent']?.map((s) => s.name).join(', ');
    if (absentNames) message += `\n⚠️ *Absent:* ${absentNames}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };


  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden text-gray-900">
      
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-900 to-slate-800 text-white p-4 flex justify-between items-center shadow-lg shrink-0 z-30">
        <button onClick={() => setIsSidebarOpen(true)}><Menu size={28} /></button>
        <h1 className="text-xl font-black tracking-wider uppercase">Pump Manager</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow-lg"><Plus size={24} /></button>
      </header>

      {/* SIDEBAR */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-left">
            <h2 className="text-2xl font-black text-slate-800 border-b-4 border-slate-800 pb-2">MENU</h2>
            <button onClick={() => { setShowAddModal(true); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-gray-700"><Users /> Add Member</button>
            <button onClick={() => { setShowMemberListModal(true); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-gray-700"><FileText /> Member List</button>
            <button onClick={() => navigate('/allshifting')} className="flex items-center gap-4 text-lg font-bold text-gray-700"><Calendar /> All Reports</button>
            <button onClick={() => setIsSidebarOpen(false)} className="mt-auto text-red-600 font-black text-xl uppercase">Close X</button>
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="p-3 bg-white shadow-md z-20 flex flex-col gap-3">
        <div className="flex bg-gray-200 rounded-xl p-1">
          {['Morning', 'Evening'].map((s) => (
            <button key={s} onClick={() => setShift(s)} className={`flex-1 py-2 rounded-lg text-sm font-black uppercase tracking-wide transition-all ${shift === s ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>{s}</button>
          ))}
        </div>
        <div className="flex gap-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl p-2 text-slate-700 font-bold outline-none" />
            <button onClick={handleAutoAssign} className="bg-orange-500 text-white p-2 rounded-xl shadow flex items-center gap-1 font-bold text-xs"><RefreshCw size={16} /> Auto</button>
        </div>
      </div>

      {/* MAIN UI (SCROLL FIX: overscroll-y-contain) */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-y-auto bg-slate-100 overscroll-y-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex flex-col items-center p-2 gap-4 pb-48"> {/* Increased padding bottom */}
            
            {/* PUMP CARD */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-4 relative mt-2">
              <h3 className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Pump Station Map</h3>
              <div className="flex w-full">
                <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-8 relative pr-2 border-r-4 border-dashed border-slate-300">
                  <DroppableZone id="N2" label="2 (TL)" className="bg-blue-50 h-24 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                    {assignments['N2'] && <DraggableStaff id={assignments['N2'].id} staffMember={assignments['N2']} />}
                  </DroppableZone>
                  <DroppableZone id="N1" label="1 (TR)" className="bg-blue-50 h-24 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                    {assignments['N1'] && <DraggableStaff id={assignments['N1'].id} staffMember={assignments['N1']} />}
                  </DroppableZone>
                  
                  {/* MPD */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-28 bg-gray-900 rounded-lg shadow-2xl flex flex-col items-center justify-center border-4 border-gray-700 z-10">
                    <div className="bg-black px-1 rounded mb-1 w-16 text-right"><span className="text-lg font-mono text-red-500 font-bold block leading-none mt-1">0.00</span></div>
                    <div className="bg-black px-1 rounded w-16 text-right"><span className="text-sm font-mono text-yellow-400 font-bold block leading-none mb-1">0.00</span></div>
                    <span className="text-[8px] text-gray-500 font-bold tracking-widest mt-1">MPD</span>
                  </div>

                  <DroppableZone id="N3" label="3 (BL)" className="bg-blue-50 h-24 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                    {assignments['N3'] && <DraggableStaff id={assignments['N3'].id} staffMember={assignments['N3']} />}
                  </DroppableZone>
                  <DroppableZone id="N4" label="4 (BR)" className="bg-blue-50 h-24 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                    {assignments['N4'] && <DraggableStaff id={assignments['N4'].id} staffMember={assignments['N4']} />}
                  </DroppableZone>
                </div>
                <div className="w-20 pl-3 flex flex-col gap-3 justify-center">
                   <DroppableZone id="N5" label="H-5" className="flex-1 bg-indigo-50 rounded-xl border-4 border-indigo-200 flex items-center justify-center">
                    {assignments['N5'] && <DraggableStaff id={assignments['N5'].id} staffMember={assignments['N5']} />}
                  </DroppableZone>
                   <DroppableZone id="N6" label="H-6" className="flex-1 bg-indigo-50 rounded-xl border-4 border-indigo-200 flex items-center justify-center">
                    {assignments['N6'] && <DraggableStaff id={assignments['N6'].id} staffMember={assignments['N6']} />}
                  </DroppableZone>
                </div>
              </div>
            </div>

            {/* ABSENT ZONE */}
            <div className="w-full max-w-md mt-1">
               <div className="text-xs font-black text-red-400 uppercase mb-1 ml-1">Absent / Unassigned</div>
               <DroppableZone id="absent" isAbsent={true} className="w-full bg-red-50 border-4 border-dashed border-red-300 rounded-2xl p-2 h-[100px] overflow-y-auto flex flex-wrap gap-2 items-start justify-start content-start">
                {absentStaff.length === 0 && <span className="text-red-300 w-full text-center mt-8 font-bold uppercase text-[10px]">Drop here</span>}
                {absentStaff.map((s) => <DraggableStaff key={s.id} id={s.id} staffMember={s} size="small" />)}
              </DroppableZone>
            </div>
          </div>
        </div>

        {/* BOTTOM DOCK (SCROLL FIX: touch-action allow) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t-2 border-gray-100 rounded-t-3xl z-40 flex flex-col pb-safe">
          <div className="px-4 pt-3 pb-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Available Staff</p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide min-h-[70px] items-center touch-pan-x">
                {availableStaff.map((staff) => <DraggableStaff key={staff.id} id={staff.id} staffMember={staff} size="small" />)}
                {availableStaff.length === 0 && <div className="text-gray-400 text-xs italic w-full text-center">All assigned!</div>}
            </div>
          </div>
          <div className="px-4 pb-4">
            <button onClick={handleSubmitReport} className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-lg py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <Share2 size={20} strokeWidth={3} /> SUBMIT TO WHATSAPP
            </button>
          </div>
        </div>

        <DragOverlay>{activeStaff ? <DraggableStaff id={activeStaff.id} staffMember={activeStaff} isOverlay /> : null}</DragOverlay>
      </DndContext>

      {/* MODALS (ADD & LIST) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                <h2 className="text-xl font-black text-blue-900 mb-4">ADD NEW STAFF</h2>
                <form onSubmit={handleAddMemberSubmit} className="flex flex-col gap-4">
                    <div className="flex justify-center">
                        <label className="relative w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 overflow-hidden bg-gray-50">
                            {newMember.image ? <img src={newMember.image} className="w-full h-full object-cover" alt="preview" /> : <span className="text-xs text-gray-400 text-center">Tap to<br/>Upload</span>}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                    <input type="text" placeholder="Name" className="bg-gray-100 p-3 rounded-xl font-bold outline-none focus:ring-2 ring-blue-500" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                    <div className="flex gap-2">
                        <select className="bg-gray-100 p-3 rounded-xl flex-1 font-bold text-sm" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}><option value="operator">Operator</option><option value="supervisor">Supervisor</option><option value="air boy">Air Boy</option></select>
                        <select className="bg-gray-100 p-3 rounded-xl flex-1 font-bold text-sm" value={newMember.shift} onChange={e => setNewMember({...newMember, shift: e.target.value})}><option value="morning">Morning</option><option value="evening">Evening</option></select>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl font-bold text-gray-600">Cancel</button>
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {showMemberListModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2">
            <div className="bg-white w-full max-w-lg rounded-2xl p-4 shadow-2xl h-[80vh] flex flex-col animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-center border-b pb-3 mb-2">
                    <h2 className="text-xl font-black text-gray-800">STAFF LIST ({members.length})</h2>
                    <button onClick={() => setShowMemberListModal(false)} className="text-red-500 font-bold px-3 bg-red-50 rounded-lg">Close</button>
                </div>
                <div className="overflow-y-auto flex-1 pr-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-500 uppercase text-xs"><tr><th className="p-3 rounded-l-lg">Name</th><th className="p-3">Role</th><th className="p-3 rounded-r-lg text-right">Action</th></tr></thead>
                        <tbody className="divide-y">
                            {members.map((m) => (
                                <tr key={m.id} className="hover:bg-blue-50">
                                    <td className="p-3 font-bold flex items-center gap-2"><img src={m.avatar || `https://ui-avatars.com/api/?name=${m.name}`} className="w-8 h-8 rounded-full" alt="" />{m.name}</td>
                                    <td className="p-3 text-gray-600 capitalize">{m.role}</td>
                                    <td className="p-3 text-right"><button onClick={() => handleDeleteMember(m.id)} className="text-red-500 bg-red-100 p-2 rounded-full hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagementSystem;