import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Users, FileText, Share2, Calendar, Plus, Trash2, RefreshCw, X, Download, Wind 
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
import html2canvas from 'html2canvas'; // Make sure to install this
import axiosInstance from '../Dashboard/axiosInstance'; 

// --- 1. Draggable Staff Card ---
const DraggableStaff = ({ id, staffMember, isOverlay = false, size = "normal", hideName = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { staffMember },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging || isOverlay ? 999 : 1,
  };

  // Sizing logic
  const isSmall = size === "small";
  const imgSize = isSmall ? "w-12 h-12 md:w-14 md:h-14" : "w-20 h-20 md:w-24 md:h-24"; 
  const textSize = isSmall ? "text-[10px]" : "text-xs md:text-sm";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center justify-center touch-none transition-transform ${
        isOverlay ? 'scale-110 opacity-95 cursor-grabbing' : 'cursor-grab hover:scale-105'
      }`}
    >
      <div className={`${imgSize} rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 transition-all`}>
        <img
          src={staffMember.avatar || `https://ui-avatars.com/api/?name=${staffMember.name}&background=random`}
          alt={staffMember.name}
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      </div>
      
      {/* Hide Name if requested (Point 3) */}
      {!hideName && (
        <span className={`${textSize} font-black text-gray-900 mt-[-10px] bg-white px-3 py-0.5 rounded-full shadow-md border border-gray-200 z-10 uppercase tracking-wider whitespace-nowrap`}>
          {staffMember.name}
        </span>
      )}
    </div>
  );
};

// --- 2. Droppable Zone ---
const DroppableZone = ({ id, children, className, label, isAbsent = false, isAir = false }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  let activeClass = '';
  if (isOver) {
    if (isAbsent) activeClass = 'bg-red-100 border-red-500 scale-105';
    else if (isAir) activeClass = 'bg-cyan-100 border-cyan-500 scale-105 shadow-xl';
    else activeClass = 'bg-green-100 border-green-600 scale-105 shadow-xl';
  }

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all duration-200 ${className} ${activeClass}`}
    >
      {label && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-sm z-20 whitespace-nowrap">
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
  const pumpMapRef = useRef(null); // Ref for saving image
  
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

  // -- SENSORS (Fix for Desktop Dragging - Point 4) --
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { 
      activationConstraint: { delay: 150, tolerance: 5 } // Lower delay for responsiveness
    })
  );

  // -- Fetch Data --
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

  // -- Calculations --
  const assignedIds = Object.values(assignments).flat().map((s) => s?.id).filter(Boolean);
  const availableStaff = members.filter((s) => s.available === 'present' && !assignedIds.includes(s.id));
  const absentStaff = assignments['absent'] || [];

  // -- Handlers --
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
        // Point 8: Logic keeps them here until moved back
        const currentAbsent = newAssignments['absent'] || [];
        newAssignments['absent'] = [...currentAbsent, draggedStaff];
      } else {
        // Handles N1-N6 and Air
        newAssignments[targetZone] = draggedStaff;
      }
      return newAssignments;
    });
  };

  // -- Point 6: Save as Image --
  const handleSaveImage = async () => {
    if (pumpMapRef.current) {
        try {
            const canvas = await html2canvas(pumpMapRef.current, {
                backgroundColor: '#ffffff',
                scale: 2, // Better quality
            });
            const link = document.createElement('a');
            link.download = `Pump_Shift_${shift}_${date}.png`;
            link.href = canvas.toDataURL();
            link.click();
            toast.success("Map Image Saved!");
        } catch (error) {
            toast.error("Failed to save image");
        }
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
    const mapLabels = { 'N1': 'Nozzle 1', 'N2': 'Nozzle 2', 'N3': 'Nozzle 3', 'N4': 'Nozzle 4', 'N5': 'Hanging 5', 'N6': 'Hanging 6', 'Air': 'Air Boy' };
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
      
      {/* --- HEADER --- */}
      <header className="bg-gradient-to-r from-blue-900 to-slate-800 text-white p-4 flex justify-between items-center shadow-lg shrink-0 z-30">
        <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)}><Menu size={28} /></button>
            <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase">Pump Manager</h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm">
            <Plus size={20} /> <span className="hidden md:inline">Add Staff</span>
        </button>
      </header>

      {/* --- SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-left">
            <div className="flex justify-between items-center border-b-4 border-slate-800 pb-2">
                <h2 className="text-2xl font-black text-slate-800">MENU</h2>
                <button onClick={() => setIsSidebarOpen(false)}><X className="text-red-600" /></button>
            </div>
            <button onClick={() => { setShowAddModal(true); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-gray-700 hover:text-blue-600 bg-gray-50 p-3 rounded-xl"><Users /> Add Member</button>
            <button onClick={() => { setShowMemberListModal(true); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-gray-700 hover:text-blue-600 bg-gray-50 p-3 rounded-xl"><FileText /> Member List</button>
            <button onClick={() => navigate('/allshifting')} className="flex items-center gap-4 text-lg font-bold text-gray-700 hover:text-blue-600 bg-gray-50 p-3 rounded-xl"><Calendar /> All Reports</button>
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* --- MAIN CONTENT WRAPPER --- */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

            {/* === LEFT SIDE: PUMP MAP === */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-slate-100 overscroll-contain md:p-6">
                
                {/* Point 1: Big Gap & Bold Buttons */}
                <div className="p-3 bg-white md:rounded-2xl shadow-md z-20 flex flex-col md:flex-row gap-6 md:items-center md:justify-between mb-4 mx-0 md:mx-auto w-full md:max-w-4xl">
                    <div className="flex gap-6 bg-gray-100 rounded-xl p-2 w-full md:w-96">
                        {['Morning', 'Evening'].map((s) => (
                            <button key={s} onClick={() => setShift(s)} className={`flex-1 py-4 rounded-xl text-xl font-black uppercase tracking-wider transition-all transform ${shift === s ? 'bg-blue-700 text-white shadow-xl scale-105' : 'bg-white text-gray-400 border-2 border-transparent hover:border-gray-300'}`}>{s}</button>
                        ))}
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl p-2 text-slate-700 font-bold outline-none" />
                        <button onClick={handleAutoAssign} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2 font-bold text-xs md:text-sm transition-colors">
                            <RefreshCw size={16} /> Auto
                        </button>
                    </div>
                </div>

                {/* Pump Map Container (Point 5: Mobile Scroll Fix) */}
                <div className="flex flex-col items-center p-2 gap-4 pb-52 md:pb-10">
                    
                    {/* Save Button (Point 6) */}
                    <button onClick={handleSaveImage} className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 self-end mr-2 md:mr-10">
                        <Download size={18}/> Save Map as Image
                    </button>

                    {/* THE MAP CARD (Ref for image saving) */}
                    <div ref={pumpMapRef} className="w-full max-w-md md:max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-4 md:p-8 relative mt-2">
                        <h3 className="text-center text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-8">Pump Station Layout</h3>
                        
                        <div className="flex w-full justify-center">
                            {/* Grid System */}
                            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-16 relative pr-4 border-r-4 border-dashed border-slate-300 max-w-lg">
                                
                                <DroppableZone id="N2" label="Nozzle 2" className="bg-blue-50 h-24 md:h-32 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                                    {assignments['N2'] && <DraggableStaff id={assignments['N2'].id} staffMember={assignments['N2']} />}
                                </DroppableZone>

                                <DroppableZone id="N1" label="Nozzle 1" className="bg-blue-50 h-24 md:h-32 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                                    {assignments['N1'] && <DraggableStaff id={assignments['N1'].id} staffMember={assignments['N1']} />}
                                </DroppableZone>

                                {/* Point 2: MPD Wide Rectangle */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 md:w-60 md:h-20 bg-gray-900 rounded-lg shadow-2xl flex flex-row items-center justify-around border-4 border-gray-700 z-10 px-2">
                                    <div className="bg-black px-2 rounded w-16 text-center border border-gray-700"><span className="text-lg font-mono text-yellow-500 font-bold">0.00</span></div>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">MPD</span>
                                    <div className="bg-black px-2 rounded w-16 text-center border border-gray-700"><span className="text-lg font-mono text-yellow-500 font-bold">0.00</span></div>
                                </div>

                                <DroppableZone id="N3" label="Nozzle 3" className="bg-blue-50 h-24 md:h-32 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                                    {assignments['N3'] && <DraggableStaff id={assignments['N3'].id} staffMember={assignments['N3']} />}
                                </DroppableZone>

                                <DroppableZone id="N4" label="Nozzle 4" className="bg-blue-50 h-24 md:h-32 rounded-xl border-4 border-blue-200 flex items-center justify-center">
                                    {assignments['N4'] && <DraggableStaff id={assignments['N4'].id} staffMember={assignments['N4']} />}
                                </DroppableZone>
                            </div>

                            {/* Right Side Hanging */}
                            <div className="w-24 md:w-32 pl-4 flex flex-col gap-6 justify-start pt-2">
                                <DroppableZone id="N5" label="H-5" className="h-24 md:h-32 bg-indigo-50 rounded-xl border-4 border-indigo-200 flex items-center justify-center">
                                    {assignments['N5'] && <DraggableStaff id={assignments['N5'].id} staffMember={assignments['N5']} />}
                                </DroppableZone>
                                <DroppableZone id="N6" label="H-6" className="h-24 md:h-32 bg-indigo-50 rounded-xl border-4 border-indigo-200 flex items-center justify-center">
                                    {assignments['N6'] && <DraggableStaff id={assignments['N6'].id} staffMember={assignments['N6']} />}
                                </DroppableZone>

                                {/* Point 7: AIR BOY SECTION */}
                                <div className="mt-auto">
                                    <DroppableZone id="Air" label="Air Boy" isAir={true} className="h-20 md:h-24 bg-cyan-50 rounded-full border-4 border-cyan-200 flex items-center justify-center relative mt-4">
                                        <Wind className="absolute text-cyan-200 w-8 h-8 z-0" />
                                        {assignments['Air'] && <DraggableStaff id={assignments['Air'].id} staffMember={assignments['Air']} size="small" />}
                                    </DroppableZone>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Absent Zone (Moved out of fixed dock for better scrolling) */}
                    <div className="md:hidden w-full max-w-md mt-4">
                       <div className="text-xs font-black text-red-400 uppercase mb-1 ml-1">Absent List</div>
                       <DroppableZone id="absent" isAbsent={true} className="w-full bg-red-50 border-4 border-dashed border-red-200 rounded-2xl p-2 h-[120px] overflow-y-auto flex flex-wrap gap-3 content-start">
                        {absentStaff.length === 0 && <span className="text-red-300 w-full text-center mt-8 font-bold uppercase text-[10px]">Drop Absent Staff Here</span>}
                        {absentStaff.map((s) => <DraggableStaff key={s.id} id={s.id} staffMember={s} size="small" />)}
                      </DroppableZone>
                    </div>

                </div>
            </div>

            {/* === RIGHT SIDE: DESKTOP PANEL / MOBILE DOCK === */}
            
            {/* Desktop: Right Sidebar */}
            <div className="hidden md:flex flex-col w-96 bg-white border-l border-gray-200 shadow-xl z-10">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-wide">Staff Roster</h3>
                    <p className="text-sm text-gray-500">Drag to assign</p>
                </div>
                
                {/* Available List Desktop (Point 3: Hide Name = true) */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h4 className="text-xs font-bold text-green-600 uppercase mb-3">Available Staff</h4>
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {availableStaff.map((staff) => (
                            <DraggableStaff key={staff.id} id={staff.id} staffMember={staff} size="small" hideName={true} />
                        ))}
                        {availableStaff.length === 0 && <div className="col-span-4 text-gray-400 italic text-sm text-center py-4 border-2 border-dashed rounded-lg">All Assigned</div>}
                    </div>

                    <h4 className="text-xs font-bold text-red-500 uppercase mb-3">Absent / Unassigned</h4>
                    <DroppableZone id="absent" isAbsent={true} className="bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-4 min-h-[200px] flex flex-wrap gap-3 content-start">
                         {absentStaff.length === 0 && <span className="text-red-300 w-full text-center mt-10 font-bold text-xs">Drop Absent Staff Here</span>}
                         {absentStaff.map((s) => <DraggableStaff key={s.id} id={s.id} staffMember={s} size="small" />)}
                    </DroppableZone>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50">
                     <button onClick={handleSubmitReport} className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-lg py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transform transition hover:-translate-y-1">
                        <Share2 size={22} /> Share to WhatsApp
                    </button>
                </div>
            </div>

            {/* Mobile: Bottom Dock */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t-2 border-gray-100 rounded-t-3xl z-40 flex flex-col pb-safe">
                <div className="px-4 pt-3 pb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Available Staff (Drag Images)</p>
                    {/* Point 3: Hide Name = true */}
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide min-h-[80px] items-center touch-pan-x px-2">
                        {availableStaff.map((staff) => (
                            <div key={staff.id} className="shrink-0">
                                <DraggableStaff id={staff.id} staffMember={staff} size="small" hideName={true} />
                            </div>
                        ))}
                        {availableStaff.length === 0 && <div className="text-gray-400 text-xs italic w-full text-center">All assigned!</div>}
                    </div>
                </div>
                <div className="px-4 pb-4">
                    <button onClick={handleSubmitReport} className="w-full bg-green-600 active:bg-green-700 text-white font-black text-lg py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <Share2 size={20} strokeWidth={3} /> SUBMIT
                    </button>
                </div>
            </div>

        </div>

        {/* --- OVERLAY --- */}
        <DragOverlay>{activeStaff ? <DraggableStaff id={activeStaff.id} staffMember={activeStaff} isOverlay /> : null}</DragOverlay>
      </DndContext>

      {/* --- ADD MEMBER MODAL --- */}
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

      {/* --- MEMBER LIST MODAL --- */}
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