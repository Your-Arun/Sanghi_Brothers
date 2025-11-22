/* Full fixed ShiftManagementSystem.jsx */
import React, { useEffect, useRef, useState } from "react";
import {
  Menu, Users, FileText, Share2, Calendar, Plus, RefreshCw, X, Download, Wind, AlertCircle, LayoutDashboard,
  Trash2
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import axiosInstance from "../Dashboard/axiosInstance";

/* Simple presentational card (used inside react-beautiful-dnd Draggable) */
const StaffCard = ({ staff, size = "normal", hideName = false }) => {
  const isSmall = size === "small";
  const imgSize = isSmall ? "w-14 h-14" : "w-20 h-20 md:w-20 md:h-20";
  const textSize = isSmall ? "text-[10px]" : "text-xs";

  return (
    <div className="flex flex-col items-center justify-center touch-none select-none">
      <div className={`${imgSize} rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200`}>
        <img
          src={staff.avatar || `https://ui-avatars.com/api/?name=${staff.name}&background=random`}
          alt={staff.name}
          className="w-full h-full object-cover"
        />
      </div>
      {!hideName && (
        <span className={`${textSize} font-black text-gray-900 mt-[-8px] bg-white px-3 py-0.5 rounded-full shadow-md border border-gray-200 z-10 uppercase tracking-wider whitespace-nowrap`}>
          {staff.name}
        </span>
      )}
    </div>
  );
};

/* Helper to generate empty columns structure */
const makeEmptyColumns = () => ({
  "available-pool": [],           // desktop available
  "available-pool-mobile": [],    // mobile available (we'll keep them in sync)
  absent: [],                     // absent list (array)
  N1: [], N2: [], N3: [], N4: [], N5: [], N6: [],
  Air: [],                        // Air is single-slot array (0 or 1)
});

const ShiftManagementSystem = () => {
  const navigate = useNavigate();
  const pumpMapRef = useRef(null);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMemberListModal, setShowMemberListModal] = useState(false);

  // Data
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [shift, setShift] = useState("Morning");
  const [members, setMembers] = useState([]); // raw fetched members
  const [columns, setColumns] = useState(makeEmptyColumns());

  // Add-member form state (kept minimal)
  const [newMember, setNewMember] = useState({ name: "", role: "operator", shift: "morning", available: "present", image: null });

  // Fetch members and populate columns
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get("/shifting");
        const formatted = res.data.map((m) => ({ ...m, id: m._id, avatar: m.avatar || null }));
        setMembers(formatted);

        // Put present members into available, absent into absent. Others empty.
        const cols = makeEmptyColumns();
        formatted.forEach((m) => {
          if (m.available === "absent") cols.absent.push(m);
          else cols["available-pool"].push(m);
        });
        // mirror for mobile available list (keeps simple)
        cols["available-pool-mobile"] = [...cols["available-pool"]];
        setColumns(cols);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch members");
      }
    };
    fetchMembers();
  }, []);

  // Utility: remove staff from all columns
  const removeFromAllCols = (staffId, cols) => {
    const copy = { ...cols };
    Object.keys(copy).forEach((k) => {
      copy[k] = copy[k].filter((s) => String(s.id) !== String(staffId));
    });
    return copy;
  };

  // Business rules: is drop allowed?
  const canDropTo = (staff, destId) => {
    const role = (staff.role || "").toLowerCase();

    // Allowed dest sets
    const availableSets = ["available-pool", "available-pool-mobile"];
    // Air boy can only go to Air or absent or available lists
    if (role === "air boy") {
      return destId === "Air" || destId === "absent" || availableSets.includes(destId);
    }

    // Operators: allow N1..N6, Air, available, absent
    if (role === "operator") {
      if (["N1","N2","N3","N4","N5","N6","Air","absent", ...availableSets].includes(destId)) return true;
      return false;
    }

    // Supervisors allow anywhere except nothing special - allow nozzles, available, absent but not block.
    if (role === "supervisor") {
      return true;
    }

    // default: allow available & absent and nozzles
    return ["N1","N2","N3","N4","N5","N6","Air","absent", ...availableSets].includes(destId);
  };

  // onDragEnd for react-beautiful-dnd
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const srcId = source.droppableId;
    const dstId = destination.droppableId;

    // if dropped in same place and same index, do nothing
    if (srcId === dstId && source.index === destination.index) return;

    // find the dragged staff (by id) from columns
    const staff = columns[srcId][source.index];
    if (!staff) return;

    // enforce role rules
    if (!canDropTo(staff, dstId)) {
      toast.error(`${staff.name} (${staff.role}) cannot be placed in "${dstId}"`);
      return;
    }

    // Single-slot destinations (N1..N6, Air) should only contain one staff.
    const singleSlots = new Set(["N1","N2","N3","N4","N5","N6","Air"]);

    // If destination is single-slot and already occupied by someone else, replace them (move them back to available)
    const newCols = removeFromAllCols(staff.id, columns);

    // If dest is single slot and has someone, move that someone back to available-pool
    if (singleSlots.has(dstId) && newCols[dstId] && newCols[dstId].length > 0) {
      const kicked = newCols[dstId][0];
      // send kicked to available-pool
      newCols["available-pool"].push(kicked);
      newCols["available-pool-mobile"].push(kicked);
      newCols[dstId] = [];
    }

    // Remove staff from source (already removed by removeFromAllCols)
    // Insert into destination at destination.index (but for single-slot we ensure index 0)
    const insertIndex = singleSlots.has(dstId) ? 0 : destination.index;
    newCols[dstId] = newCols[dstId] || [];
    newCols[dstId].splice(insertIndex, 0, staff);

    // keep mobile available mirrored to desktop available
    if (dstId === "available-pool-mobile") {
      newCols["available-pool"] = [...newCols["available-pool"], staff];
    } else if (dstId === "available-pool") {
      newCols["available-pool-mobile"] = [...newCols["available-pool-mobile"], staff];
    }

    // Ensure available lists deduped
    const uniqueById = (arr) => {
      const map = new Map();
      arr.forEach((x) => map.set(String(x.id), x));
      return Array.from(map.values());
    };
    newCols["available-pool"] = uniqueById(newCols["available-pool"]);
    newCols["available-pool-mobile"] = uniqueById(newCols["available-pool-mobile"]);

    setColumns(newCols);
  };

  // Save image same as before
  const handleSaveImage = async () => {
    if (pumpMapRef.current) {
      try {
        const canvas = await html2canvas(pumpMapRef.current, { backgroundColor: "#ffffff", scale: 2 });
        const link = document.createElement("a");
        link.download = `Pump_Shift_${shift}_${date}.png`;
        link.href = canvas.toDataURL();
        link.click();
        toast.success("Map Saved!");
      } catch (error) {
        toast.error("Failed to save image");
      }
    }
  };

  // Auto assign: fill N1..N6 with available operators (respect single-slot)
  const handleAutoAssign = () => {
    const available = columns["available-pool"].slice();
    const operators = available.filter((m) => (m.role || "").toLowerCase() === "operator" && m.shift?.toLowerCase() === shift.toLowerCase());
    const newCols = { ...columns };

    // clear N1..N6, push existing occupants back to available
    ["N1","N2","N3","N4","N5","N6"].forEach((nid) => {
      if (newCols[nid] && newCols[nid].length > 0) {
        // move current occupant back to available
        newCols["available-pool"].push(...newCols[nid]);
        newCols["available-pool-mobile"].push(...newCols[nid]);
      }
      newCols[nid] = [];
    });

    // assign sequentially
    for (let i = 0; i < 6; i++) {
      if (operators[i]) {
        // remove operator from available lists
        newCols = removeFromAllCols(operators[i].id, newCols);
        newCols["N" + (i + 1)] = [operators[i]];
      }
    }

    // keep available mirrored
    newCols["available-pool-mobile"] = [...newCols["available-pool"]];
    setColumns(newCols);
    toast.success(`Auto-assigned ${shift}`);
  };

  // Add member (POST) - simplified; after success add to available
  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!newMember.name) return;
    try {
      const response = await axiosInstance.post("/shifting", newMember);
      const saved = { ...response.data, id: response.data._id, avatar: newMember.image };
      setMembers((m) => [...m, saved]);

      const newCols = { ...columns };
      if (saved.available === "absent") newCols.absent.push(saved);
      else newCols["available-pool"].push(saved);
      newCols["available-pool-mobile"] = [...newCols["available-pool"]];
      setColumns(newCols);

      setNewMember({ name: "", role: "operator", shift: "morning", available: "present", image: null });
      setShowAddModal(false);
      toast.success("Member Added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add member");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewMember({ ...newMember, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await axiosInstance.delete(`/shifting/${id}`);
      setMembers((m) => m.filter((x) => x.id !== id));
      // remove from all cols
      setColumns((cols) => removeFromAllCols(id, cols));
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  // Report builder (reads columns)
  const handleSubmitReport = () => {
    let message = `*⛽ Petrol Pump Shift Report*\n📅 Date: ${date}\n🕒 Shift: ${shift}\n\n*Assignments:*\n`;
    const mapLabels = { N1: "Nozzle 1", N2: "Nozzle 2", N3: "Nozzle 3", N4: "Nozzle 4", N5: "Hanging 5", N6: "Hanging 6", Air: "Air Boy" };
    Object.entries(mapLabels).forEach(([key, label]) => {
      const staff = columns[key] && columns[key].length > 0 ? columns[key][0] : null;
      message += `${label}: ${staff ? staff.name : "❌ Empty"}\n`;
    });
    const absentNames = (columns.absent || []).map((s) => s.name).join(", ");
    if (absentNames) message += `\n⚠️ *Absent:* ${absentNames}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Small helpers for rendering styles
  const droppableClass = (extra = "") => `rounded-2xl p-2 ${extra}`;
  const singleSlotStyle = "h-28 md:h-32 rounded-2xl border-4 flex items-center justify-center";

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden text-gray-900">

      {/* Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)}><Menu size={28} /></button>
          <h1 className="text-xl font-black tracking-wider uppercase">Pump Manager</h1>
        </div>
      </header>

      {/* Sidebar (mobile overlay) */}
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

      {/* MAIN */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-2xl z-40">
            <div className="p-6 border-b border-slate-700 flex items-center gap-3">
              <LayoutDashboard size={28} className="text-blue-400" />
              <h1 className="text-xl font-black tracking-wider uppercase">Pump OS</h1>
            </div>
            <nav className="flex-1 p-4 flex flex-col gap-2">
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition text-gray-300 hover:text-white font-bold">
                <Plus size={20} /> Add Staff
              </button>
              <button onClick={() => setShowMemberListModal(true)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition text-gray-300 hover:text-white font-bold">
                <Users size={20} /> Staff List
              </button>
              <button onClick={() => navigate('/allshifting')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition text-gray-300 hover:text-white font-bold">
                <Calendar size={20} /> Reports
              </button>
            </nav>
          </aside>

          {/* Center */}
          <div className="flex-1 flex flex-col bg-slate-100 relative h-full md:overflow-hidden">
            {/* Desktop top bar */}
            <div className="hidden md:flex p-3 bg-white shadow-sm justify-between items-center z-20 shrink-0">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide">Dashboard</h2>
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 rounded-lg p-1 scale-90">
                  {["Morning","Evening"].map((s) => (
                    <button key={s} onClick={() => setShift(s)} className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${shift===s ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}>{s}</button>
                  ))}
                </div>
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="bg-gray-100 border-none rounded-lg px-2 py-1 font-bold text-gray-700 text-xs" />
                <button onClick={handleAutoAssign} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2"><RefreshCw size={14} /> Auto</button>
              </div>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden p-4 flex flex-col gap-4">
              <div className="flex gap-4 bg-white rounded-2xl p-2 shadow-sm w-full">
                {["Morning","Evening"].map((s) => (
                  <button key={s} onClick={() => setShift(s)} className={`flex-1 py-3 rounded-xl text-lg font-black uppercase tracking-wider transition-all ${shift===s ? "bg-blue-700 text-white shadow-lg" : "text-gray-400"}`}>{s}</button>
                ))}
              </div>
              <div className="flex gap-3">
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-xl p-3 text-gray-700 font-bold outline-none shadow-sm" />
                <button onClick={handleAutoAssign} className="bg-orange-500 text-white px-5 py-3 rounded-xl shadow-lg font-bold"><RefreshCw size={18} /></button>
              </div>
            </div>

            {/* Map area */}
            <div className="flex-1 overflow-y-auto md:overflow-hidden p-4 pb-48 md:pb-0 flex flex-col items-center justify-start md:justify-center">
              {/* mobile absent zone */}
              <div className="md:hidden w-full max-w-md mb-4">
                <div className="flex items-center gap-1 mb-1 ml-1 text-xs font-black text-red-400 uppercase"><AlertCircle size={12}/> Absent Zone</div>

                <Droppable droppableId="absent">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-full bg-red-50 border-4 border-dashed border-red-200 rounded-2xl p-2 min-h-[90px] flex items-center gap-2 overflow-x-auto ${snapshot.isDraggingOver ? "bg-red-100" : ""}`}
                    >
                      {columns.absent.length === 0 && <span className="text-red-300 w-full text-center font-bold uppercase text-[10px]">Drag Absent Staff Here</span>}
                      {columns.absent.map((s, idx) => (
                        <Draggable key={s.id} draggableId={String(s.id)} index={idx}>
                          {(prov) => (
                            <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="shrink-0 mr-2">
                              <StaffCard staff={s} size="small" hideName />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* save button mobile */}
              <button onClick={handleSaveImage} className="md:hidden flex items-center gap-2 text-blue-600 font-bold bg-white px-3 py-1.5 rounded-full shadow hover:bg-blue-50 text-xs mb-2 self-end"><Download size={16}/> Save Image</button>

              {/* Map Card */}
              <div ref={pumpMapRef} className="w-full max-w-md md:max-w-3xl bg-white rounded-[2rem] shadow-xl border-4 border-slate-200 p-6 md:p-10 relative transform md:scale-90 lg:scale-100 origin-center transition-transform">
                <h3 className="text-center text-slate-300 text-xs md:text-xs font-black uppercase tracking-[0.4em] mb-8 md:mb-12">Pump Station Layout</h3>

                <div className="flex w-full justify-center">
                  {/* Nozzles grid */}
                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-16 md:gap-y-12 relative pr-6 border-r-4 border-dashed border-slate-300 max-w-lg">
                    {["N2","N1","N3","N4"].map((nid) => (
                      <Droppable key={nid} droppableId={nid}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`${singleSlotStyle} ${nid.startsWith("N") ? "bg-blue-50 border-blue-200 border-4 rounded-2xl" : ""} ${snapshot.isDraggingOver ? "bg-green-100 scale-105" : ""}`}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              {columns[nid] && columns[nid][0] ? (
                                <Draggable key={columns[nid][0].id} draggableId={String(columns[nid][0].id)} index={0}>
                                  {(prov) => (
                                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                                      <StaffCard staff={columns[nid][0]} />
                                    </div>
                                  )}
                                </Draggable>
                              ) : <div className="text-xs text-gray-400 font-bold uppercase">Drop here</div>}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    ))}

                    {/* center meter */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-16 md:w-64 md:h-20 bg-slate-900 rounded-xl shadow-2xl flex flex-row items-center justify-around border-4 border-slate-700 z-10 px-2">
                      <div className="bg-black px-3 py-1 rounded w-16 text-center border border-gray-700"><span className="text-lg md:text-lg font-mono text-yellow-500 font-bold">0.00</span></div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">MPD</span>
                      <div className="bg-black px-3 py-1 rounded w-16 text-center border border-gray-700"><span className="text-lg md:text-lg font-mono text-yellow-500 font-bold">0.00</span></div>
                    </div>
                  </div>

                  {/* Hanging + Air */}
                  <div className="w-24 md:w-32 pl-6 flex flex-col gap-6 justify-start pt-2">
                    {["N5","N6"].map((nid) => (
                      <Droppable key={nid} droppableId={nid}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className={`${singleSlotStyle} bg-indigo-50 border-indigo-200 border-4 rounded-2xl ${snapshot.isDraggingOver ? "bg-green-100" : ""}`}>
                            <div className="w-full h-full flex items-center justify-center">
                              {columns[nid] && columns[nid][0] ? (
                                <Draggable key={columns[nid][0].id} draggableId={String(columns[nid][0].id)} index={0}>
                                  {(prov) => (
                                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                                      <StaffCard staff={columns[nid][0]} />
                                    </div>
                                  )}
                                </Draggable>
                              ) : <div className="text-xs text-gray-400 font-bold uppercase">Drop</div>}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    ))}

                    {/* Air */}
                    <Droppable droppableId="Air">
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={`h-24 md:h-24 bg-cyan-50 rounded-full border-4 border-cyan-200 flex items-center justify-center relative ${snapshot.isDraggingOver ? "bg-cyan-100" : ""}`}>
                          <Wind className="absolute text-cyan-200 w-10 h-10 z-0" />
                          <div className="z-10">
                            {columns.Air && columns.Air[0] ? (
                              <Draggable key={columns.Air[0].id} draggableId={String(columns.Air[0].id)} index={0}>
                                {(prov) => (
                                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                                    <StaffCard staff={columns.Air[0]} size="small" />
                                  </div>
                                )}
                              </Draggable>
                            ) : <div className="text-xs text-gray-400 font-bold uppercase">Air Boy</div>}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar (desktop) */}
          <aside className="hidden md:flex flex-col w-[300px] bg-white border-l border-gray-200 shadow-xl z-30">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">Staff Roster</h3>
              <p className="text-[10px] text-gray-500">Drag to map to assign</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Available Pool */}
              <div>
                <h4 className="text-[10px] font-bold text-green-600 uppercase mb-2 flex items-center gap-2"><Users size={12}/> Available ({columns["available-pool"].length})</h4>
                <Droppable droppableId="available-pool" direction="vertical">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className={`bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-2 min-h-[120px] ${snapshot.isDraggingOver ? "bg-blue-100" : ""}`}>
                      <div className="grid grid-cols-3 gap-2">
                        {columns["available-pool"].map((staff, idx) => (
                          <Draggable key={staff.id} draggableId={String(staff.id)} index={idx}>
                            {(prov) => (
                              <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="bg-white p-1 rounded-lg flex items-center justify-center">
                                <StaffCard staff={staff} size="small" hideName />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {columns["available-pool"].length === 0 && <div className="col-span-3 text-gray-400 italic text-xs text-center mt-4">All Assigned</div>}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Absent (desktop) */}
              <div>
                <h4 className="text-[10px] font-bold text-red-500 uppercase mb-2 flex items-center gap-2"><AlertCircle size={12}/> Absent / Leave</h4>
                <Droppable droppableId="absent">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className={`bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-2 min-h-[120px] flex flex-wrap gap-2 content-start ${snapshot.isDraggingOver ? "bg-red-100" : ""}`}>
                      {columns.absent.map((s, idx) => (
                        <Draggable key={s.id} draggableId={String(s.id)} index={idx}>
                          {(prov) => (
                            <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="bg-white p-1 rounded-lg flex items-center gap-2">
                              <StaffCard staff={s} size="small" />
                              <button onClick={() => {
                                setColumns((cols) => {
                                  const copy = removeFromAllCols(s.id, cols);
                                  copy["available-pool"].push(s);
                                  copy["available-pool-mobile"].push(s);
                                  return copy;
                                });
                              }} className="text-red-500 p-1 rounded-full">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columns.absent.length === 0 && <span className="text-red-300 w-full text-center mt-8 font-bold text-[10px]">Drop Absent Staff Here</span>}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Save button */}
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

          {/* Mobile bottom dock */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-200 rounded-t-[2rem] z-40 flex flex-col pb-safe">
            <div className="px-6 pt-4 pb-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Available Staff</span>
                <span className="text-blue-500">Drag back to reset</span>
              </p>

              <Droppable droppableId="available-pool-mobile" direction="horizontal">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={`flex gap-4 overflow-x-auto pb-4 min-h-[80px] items-center px-2 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}>
                    {columns["available-pool-mobile"].map((staff, idx) => (
                      <Draggable key={staff.id} draggableId={String(staff.id)} index={idx}>
                        {(prov) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="shrink-0">
                            <StaffCard staff={staff} size="small" hideName />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns["available-pool-mobile"].length === 0 && <div className="text-gray-400 text-xs italic w-full text-center">All assigned!</div>}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="px-6 pb-6">
              <button onClick={handleSubmitReport} className="w-full bg-green-600 active:bg-green-700 text-white font-black text-lg py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <Share2 size={20} strokeWidth={3} /> SUBMIT REPORT
              </button>
            </div>
          </div>

        </div>
      </DragDropContext>

      {/* Add / list modals (kept same-ish) */}
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
              <input type="text" placeholder="Name" className="bg-gray-100 p-3 rounded-xl font-bold outline-none focus:ring-2 ring-blue-500" value={newMember.name} onChange={(e)=>setNewMember({...newMember, name:e.target.value})} />
              <div className="flex gap-2">
                <select className="bg-gray-100 p-3 rounded-xl flex-1 font-bold text-sm" value={newMember.role} onChange={e=>setNewMember({...newMember, role:e.target.value})}>
                  <option value="operator">Operator</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="air boy">Air Boy</option>
                </select>
                <select className="bg-gray-100 p-3 rounded-xl flex-1 font-bold text-sm" value={newMember.shift} onChange={e=>setNewMember({...newMember, shift:e.target.value})}>
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={()=>setShowAddModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl font-bold text-gray-600">Cancel</button>
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
              <button onClick={()=>setShowMemberListModal(false)} className="text-red-500 font-bold px-3 bg-red-50 rounded-lg">Close</button>
            </div>
            <div className="overflow-y-auto flex-1 pr-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-500 uppercase text-xs"><tr><th className="p-3 rounded-l-lg">Name</th><th className="p-3">Role</th><th className="p-3 rounded-r-lg text-right">Action</th></tr></thead>
                <tbody className="divide-y">
                  {members.map((m)=>(
                    <tr key={m.id} className="hover:bg-blue-50">
                      <td className="p-3 font-bold flex items-center gap-2"><img src={m.avatar || `https://ui-avatars.com/api/?name=${m.name}`} className="w-8 h-8 rounded-full" alt="" />{m.name}</td>
                      <td className="p-3 text-gray-600 capitalize">{m.role}</td>
                      <td className="p-3 text-right"><button onClick={()=>handleDeleteMember(m.id)} className="text-red-500 bg-red-100 p-2 rounded-full hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button></td>
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
