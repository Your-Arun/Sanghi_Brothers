import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Users, FileText, Share2, Calendar, Plus, RefreshCw, X, Download, Wind, AlertCircle, LayoutDashboard, 
  Trash2, ShieldCheck // Added ShieldCheck for Supervisor
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
import html2canvas from 'html2canvas';
import axiosInstance from '../Dashboard/axiosInstance'; 

/* --- DraggableStaff --- */
const DraggableStaff = ({ id, staffMember, isOverlay = false, size = "normal", hideName = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(id),
    data: { staffMember },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging || isOverlay ? 9999 : 10,
  };

  // Adjusted sizes for the smaller/circular layout
  const isSmall = size === "small";
  const imgSize = isSmall ? "w-12 h-12" : "w-16 h-16"; // Slightly smaller standard size
  const textSize = isSmall ? "text-[9px]" : "text-[10px]";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center justify-center touch-none transition-transform ${
        isOverlay ? 'scale-110 opacity-95 cursor-grabbing' : 'cursor-grab hover:scale-105 active:cursor-grabbing'
      }`}
    >
      <div className={`${imgSize} rounded-full overflow-hidden border-[3px] border-white shadow-md bg-gray-200 transition-all`}>
        <img
          src={staffMember.avatar || `https://ui-avatars.com/api/?name=${staffMember.name}&background=random`}
          alt={staffMember.name}
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      </div>
      {!hideName && (
        <span className={`${textSize} font-black text-gray-900 mt-[-6px] bg-white px-2 py-0.5 rounded-full shadow-md border border-gray-200 z-10 uppercase tracking-wider whitespace-nowrap`}>
          {staffMember.name}
        </span>
      )}
    </div>
  );
};

/* --- DroppableZone --- */
const DroppableZone = ({ id, children, className, label, isAbsent = false, isAir = false, isSupervisor = false, isPool = false }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  let activeClass = '';
  if (isOver) {
    if (isAbsent) activeClass = 'bg-red-100 border-red-500 ring-4 ring-red-200 scale-105';
    else if (isAir) activeClass = 'bg-cyan-100 border-cyan-500 scale-110 shadow-xl';
    else if (isSupervisor) activeClass = 'bg-purple-100 border-purple-500 scale-110 shadow-xl'; // Supervisor Hover
    else if (isPool) activeClass = 'bg-blue-100 border-blue-500 ring-4 ring-blue-200';
    else activeClass = 'bg-green-100 border-green-600 scale-105 shadow-xl';
  }

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all duration-200 ${className} ${activeClass}`}
    >
      {label && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm z-20 whitespace-nowrap border border-slate-600">
          {label}
        </div>
      )}
      {children}
    </div>
  );
};

/* --- MAIN COMPONENT --- */
const ShiftManagementSystem = () => {
  const navigate = useNavigate();
  const pumpMapRef = useRef(null); 
  
  // UI & Data State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMemberListModal, setShowMemberListModal] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeStaff, setActiveStaff] = useState(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('Morning');
  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState({});
  
  const [newMember, setNewMember] = useState({
    name: "", role: "operator", shift: 'morning', available: 'present', image: null
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
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

  const getCleanId = (id) => String(id).replace(/^(desk-|mob-)/, '');
  const normalizeZone = (zoneId) => zoneId ? String(zoneId).replace(/-mobile$/, '') : null;

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const cleanId = getCleanId(active.id);
    let staff = members.find((s) => String(s.id) === cleanId);
    setActiveStaff(staff);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveStaff(null);
    if (!over) return;

    const staffId = getCleanId(String(active.id));
    const targetZone = normalizeZone(String(over.id));
    const draggedStaff = members.find((s) => String(s.id) === staffId);
    
    if (!draggedStaff) return;

    setAssignments((prev) => {
      const newAssignments = { ...prev };
      // Remove from old lists
      if (Array.isArray(newAssignments['absent'])) {
        newAssignments['absent'] = newAssignments['absent'].filter((s) => String(s.id) !== staffId);
      }
      Object.keys(newAssignments).forEach((key) => {
        if (key !== 'absent' && newAssignments[key]?.id && String(newAssignments[key].id) === staffId) {
          newAssignments[key] = null;
        }
      });

      // Assign to new zone
      if (targetZone === 'absent') {
        const currentAbsent = Array.isArray(newAssignments['absent']) ? newAssignments['absent'] : [];
        if (!currentAbsent.find(s => String(s.id) === staffId)) {
            newAssignments['absent'] = [...currentAbsent, draggedStaff];
        }
      } else if (targetZone !== 'available-pool' && targetZone) {
        newAssignments[targetZone] = draggedStaff;
      }
      return newAssignments;
    });
  };

  const handleSaveImage = async () => {
    if (pumpMapRef.current) {
        try {
            const canvas = await html2canvas(pumpMapRef.current, { backgroundColor: '#ffffff', scale: 2 });
            const link = document.createElement('a');
            link.download = `Pump_Shift_${shift}_${date}.png`;
            link.href = canvas.toDataURL();
            link.click();
            toast.success("Map Saved!");
        } catch (error) { toast.error("Failed to save image"); }
    }
  };

  const handleAutoAssign = () => {
    const assignedIds = Object.values(assignments).flat().map((s) => s?.id).filter(Boolean);
    const availableForShift = members.filter((m) => m.available === "present" && !assignedIds.includes(m.id));
    
    const shuffleArray = (array) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    let operators = availableForShift.filter(m => m.shift.toLowerCase() === shift.toLowerCase() && m.role === 'operator');
    operators = shuffleArray(operators);
    
    const newAssigns = { ...assignments };
    ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'].forEach((nid, index) => {
        if (operators[index] && !newAssigns[nid]) newAssigns[nid] = operators[index];
    });
    setAssignments(newAssigns);
    toast.success(`Auto-assigned ${shift}!`);
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
    } catch (error) { toast.error("Failed"); }
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
    // Added Supervisor to mapLabels
    const mapLabels = { 
        'Supervisor': '👮 Supervisor', 
        'N1': '⛽ Nozzle 1', 'N2': '⛽ Nozzle 2', 'N3': '⛽ Nozzle 3', 'N4': '⛽ Nozzle 4', 
        'N5': '🪝 Hanging 5', 'N6': '🪝 Hanging 6', 'Air': '💨 Air Boy' 
    };
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
      
      {/* HEADER (mobile) */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg shrink-0 z-30">
        <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)}><Menu size={28} /></button>
            <h1 className="text-xl font-black tracking-wider uppercase">Pump Manager</h1>
        </div>
      </header>

      {/* SIDEBAR OVERLAY (mobile) */}
      {isSidebarOpen && (
        <div className="md:hidden absolute inset-0 z-50 flex">
          <div className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-left">
            <div className="flex justify-between items-center border-b-4 border-slate-800 pb-2">
                <h2 className="text-2xl font-black text-slate-800">MENU</h2>
                <button onClick={() => setIsSidebarOpen(false)}><X className="text-red-600" /></button>
            </div>
            <button onClick={() => { setShowAddModal(true); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-gray-700"><Users /> Add Member</button>
            <button onClick={() => { setShowMemberListModal(true); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-gray-700"><FileText /> Member List</button>
            <button onClick={() => navigate('/allshifting')} className="flex items-center gap-4 text-lg font-bold text-gray-700"><Calendar /> All Reports</button>
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-2xl z-40">
                <div className="p-6 border-b border-slate-700 flex items-center gap-3">
                    <LayoutDashboard size={28} className="text-blue-400"/>
                    <h1 className="text-xl font-black tracking-wider uppercase">Pump System</h1>
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <div onClick={() => setShowAddModal(true)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition text-gray-300 hover:text-white font-bold cursor-pointer">
                        <Plus size={20} /> Add Staff
                    </div>
                    <div onClick={() => setShowMemberListModal(true)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition text-gray-300 hover:text-white font-bold cursor-pointer">
                        <Users size={20} /> Staff List
                    </div>
                    <div onClick={() => navigate('/allshifting')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition text-gray-300 hover:text-white font-bold cursor-pointer">
                        <Calendar size={20} /> Reports
                    </div>
                </nav>
            </aside>

            {/* CENTER AREA */}
            <div className="flex-1 flex flex-col bg-slate-100 relative h-full md:overflow-hidden">
                {/* Desktop Top Bar */}
                <div className="hidden md:flex p-3 bg-white shadow-sm justify-between items-center z-20 shrink-0">
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide">Dashboard</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 rounded-lg p-1 scale-90">
                             {['Morning', 'Evening'].map((s) => (
                                <div key={s} onClick={() => setShift(s)} className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all cursor-pointer ${shift === s ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>{s}</div>
                            ))}
                        </div>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-gray-100 border-none rounded-lg px-2 py-1 font-bold text-gray-700 text-xs" />
                        <button onClick={handleAutoAssign} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2"><RefreshCw size={14} /> Auto</button>
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="md:hidden p-4 flex flex-col gap-4">
                    <div className="flex gap-4 bg-white rounded-2xl p-2 shadow-sm w-full">
                        {['Morning', 'Evening'].map((s) => (
                            <button key={s} onClick={() => setShift(s)} className={`flex-1 py-3 rounded-xl text-lg font-black uppercase tracking-wider transition-all ${shift === s ? 'bg-blue-700 text-white shadow-lg' : 'text-gray-400'}`}>{s}</button>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-xl p-3 text-gray-700 font-bold outline-none shadow-sm" />
                        <button onClick={handleAutoAssign} className="bg-orange-500 text-white px-5 py-3 rounded-xl shadow-lg font-bold"><RefreshCw size={18} /></button>
                    </div>
                </div>

                {/* MAP AREA */}
                <div className="flex-1 overflow-y-auto md:overflow-hidden p-2 pb-48 md:pb-0 flex flex-col items-center justify-start md:justify-center">
                    
                    {/* Mobile Absent Zone */}
                    <div className="md:hidden w-full max-w-[350px] mb-4">
                       <div className="flex items-center gap-1 mb-1 ml-1 text-xs font-black text-red-400 uppercase"><AlertCircle size={12}/> Absent Zone</div>
                       <DroppableZone id="absent-mobile" isAbsent={true} className="w-full bg-red-50 border-4 border-dashed border-red-200 rounded-full p-2 min-h-[70px] flex items-center gap-2 overflow-x-auto px-4">
                        {absentStaff.length === 0 && <span className="text-red-300 w-full text-center font-bold uppercase text-[10px]">Drag Absent Staff Here</span>}
                        {absentStaff.map((s) => <div key={s.id} className="shrink-0"><DraggableStaff id={`mob-${s.id}`} staffMember={s} size="small" hideName={true} /></div>)}
                      </DroppableZone>
                    </div>

                    <button onClick={handleSaveImage} className="md:hidden flex items-center gap-2 text-blue-600 font-bold bg-white px-3 py-1.5 rounded-full shadow hover:bg-blue-50 text-xs mb-2 self-end mr-4"><Download size={16}/> Save Image</button>

                    {/* ======================================================= */}
                    {/*                     THE MAP CARD                        */}
                    {/* ======================================================= */}
                    <div ref={pumpMapRef} className="bg-white rounded-[2.5rem] shadow-xl border-[6px] border-slate-200 p-8 relative flex flex-col items-center justify-center transform scale-95 md:scale-100">
                        
                        {/* Title inside Card */}
                        <div className="absolute top-4 w-full text-center">
                            <h3 className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">Pump Layout</h3>
                        </div>

                        {/* Supervisor - Top Left Absolute */}
                        <div className="absolute top-6 left-6 z-20">
                             <DroppableZone id="Supervisor" label="Supervisor" isSupervisor={true} className="w-20 h-20 bg-purple-50 rounded-full border-[3px] border-purple-200 flex items-center justify-center relative shadow-sm">
                                <ShieldCheck className="absolute text-purple-200 w-8 h-8 z-0" />
                                {assignments['Supervisor'] && <DraggableStaff id={assignments['Supervisor'].id} staffMember={assignments['Supervisor']} size="small" />}
                            </DroppableZone>
                        </div>

                        {/* Layout Container */}
                        <div className="mt-8 flex gap-8 items-center">
                            
                            {/* LEFT SIDE: The 4 Nozzles + MPD */}
                            <div className="relative p-4">
                                {/* Dotted Border for the island */}
                                <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-[3rem] -z-10"></div>

                                {/* The Grid for Nozzles */}
                                <div className="grid grid-cols-2 gap-x-24 gap-y-24 relative z-10 p-2">
                                    {/* Top Row: N2, N1 */}
                                    <DroppableZone id="N2" label="Nozzle 2" className="w-24 h-24 bg-blue-50 rounded-full border-[3px] border-blue-200 flex items-center justify-center shadow-md">
                                        {assignments['N2'] && <DraggableStaff id={assignments['N2'].id} staffMember={assignments['N2']} size="small" />}
                                    </DroppableZone>
                                    <DroppableZone id="N1" label="Nozzle 1" className="w-24 h-24 bg-blue-50 rounded-full border-[3px] border-blue-200 flex items-center justify-center shadow-md">
                                        {assignments['N1'] && <DraggableStaff id={assignments['N1'].id} staffMember={assignments['N1']} size="small" />}
                                    </DroppableZone>

                                    {/* Bottom Row: N3, N4 */}
                                    <DroppableZone id="N3" label="Nozzle 3" className="w-24 h-24 bg-blue-50 rounded-full border-[3px] border-blue-200 flex items-center justify-center shadow-md">
                                        {assignments['N3'] && <DraggableStaff id={assignments['N3'].id} staffMember={assignments['N3']} size="small" />}
                                    </DroppableZone>
                                    <DroppableZone id="N4" label="Nozzle 4" className="w-24 h-24 bg-blue-50 rounded-full border-[3px] border-blue-200 flex items-center justify-center shadow-md">
                                        {assignments['N4'] && <DraggableStaff id={assignments['N4'].id} staffMember={assignments['N4']} size="small" />}
                                    </DroppableZone>
                                </div>

                                {/* CENTER MPD DIV */}
                                {/* Positioned absolutely in the exact center of the grid */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-slate-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center border-4 border-slate-600 z-0">
                                    <div className="w-full h-1 bg-slate-600 absolute top-1/2 left-0 -translate-y-1/2 -z-10 scale-150"></div> {/* Horizontal pipe */}
                                    <div className="w-1 h-full bg-slate-600 absolute left-1/2 top-0 -translate-x-1/2 -z-10 scale-150"></div> {/* Vertical pipe */}
                                    <span className="text-2xl font-black text-white tracking-widest">MPD</span>
                                    <span className="text-[8px] text-slate-400 uppercase font-bold mt-1">Central Unit</span>
                                </div>
                            </div>

                            {/* RIGHT SIDE: Hanging + Air */}
                            <div className="flex flex-col gap-5 border-l-2 border-dashed border-slate-200 pl-8 py-2">
                                <DroppableZone id="N5" label="H-5" className="w-20 h-20 bg-indigo-50 rounded-full border-[3px] border-indigo-200 flex items-center justify-center shadow-sm">
                                    {assignments['N5'] && <DraggableStaff id={assignments['N5'].id} staffMember={assignments['N5']} size="small" />}
                                </DroppableZone>
                                <DroppableZone id="N6" label="H-6" className="w-20 h-20 bg-indigo-50 rounded-full border-[3px] border-indigo-200 flex items-center justify-center shadow-sm">
                                    {assignments['N6'] && <DraggableStaff id={assignments['N6'].id} staffMember={assignments['N6']} size="small" />}
                                </DroppableZone>
                                
                                <div className="mt-4">
                                    <DroppableZone id="Air" label="Air Boy" isAir={true} className="w-20 h-20 bg-cyan-50 rounded-full border-[3px] border-cyan-200 flex items-center justify-center relative shadow-sm">
                                        <Wind className="absolute text-cyan-200 w-8 h-8 z-0" />
                                        {assignments['Air'] && <DraggableStaff id={assignments['Air'].id} staffMember={assignments['Air']} size="small" />}
                                    </DroppableZone>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR (DESKTOP) */}
            <aside className="hidden md:flex flex-col w-[300px] bg-white border-l border-gray-200 shadow-xl z-30">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">Staffs</h3>
                    <p className="text-[10px] text-gray-500">Drag & Drop assignments</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Available Pool */}
                    <div>
                        <h4 className="text-[10px] font-bold text-green-600 uppercase mb-2 flex items-center gap-2"><Users size={12}/> Available ({availableStaff.length})</h4>
                        <DroppableZone id="available-pool" isPool={true} className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-2 min-h-[120px]">
                            <div className="grid grid-cols-4 gap-2">
                                {availableStaff.map((staff) => (
                                    <DraggableStaff key={staff.id} id={`desk-${staff.id}`} staffMember={staff} size="small" hideName={true} />
                                ))}
                                {availableStaff.length === 0 && <div className="col-span-4 text-gray-400 italic text-xs text-center mt-4">All Assigned</div>}
                            </div>
                        </DroppableZone>
                    </div>

                    {/* Absent List */}
                    <div>
                         <h4 className="text-[10px] font-bold text-red-500 uppercase mb-2 flex items-center gap-2"><AlertCircle size={12}/> Absent / Leave</h4>
                        <DroppableZone id="absent" isAbsent={true} className="bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-2 min-h-[100px] flex flex-wrap gap-2 content-start">
                             {absentStaff.length === 0 && <span className="text-red-300 w-full text-center mt-6 font-bold text-[10px]">Drop Absent Staff Here</span>}
                             {absentStaff.map((s) => <DraggableStaff key={s.id} id={`desk-${s.id}`} staffMember={s} size="small" hideName={true} />)}
                        </DroppableZone>
                    </div>
                    
                    <button onClick={handleSaveImage} className="w-full flex items-center justify-center gap-2 text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 py-3 rounded-xl border border-blue-200 transition-colors text-sm">
                        <Download size={16}/> Save Map Image
                    </button>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                     <button onClick={handleSubmitReport} className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-sm py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transform transition hover:-translate-y-1">
                        <Share2 size={18} /> Share Report
                    </button>
                </div>
            </aside>

            {/* MOBILE BOTTOM DOCK */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-200 rounded-t-[2rem] z-40 flex flex-col pb-safe">
                <div className="px-6 pt-4 pb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Available Staff</span>
                        <span className="text-blue-500">Drag back to reset</span>
                    </p>
                    <DroppableZone id="available-pool-mobile" isPool={true} className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide min-h-[70px] items-center px-2 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                        {availableStaff.map((staff) => (
                            <div key={staff.id} className="shrink-0">
                                <DraggableStaff id={`mob-${staff.id}`} staffMember={staff} size="small" hideName={true} />
                            </div>
                        ))}
                        {availableStaff.length === 0 && <div className="text-gray-400 text-xs italic w-full text-center">All assigned!</div>}
                    </DroppableZone>
                </div>
                <div className="px-6 pb-6">
                    <button onClick={handleSubmitReport} className="w-full bg-green-600 active:bg-green-700 text-white font-black text-lg py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <Share2 size={20} strokeWidth={3} /> SUBMIT REPORT
                    </button>
                </div>
            </div>

        </div>

        <DragOverlay>
            {activeStaff ? <DraggableStaff id={activeStaff.id} staffMember={activeStaff} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* MODALS (Add/List) remain the same as previous code... */}
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