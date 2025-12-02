import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, Users, FileText, Share2, Calendar, Plus, RefreshCw, X, Download, Wind, AlertCircle, LayoutDashboard,
  Trash2, ShieldCheck, Edit3, UserPlus, Settings as SettingsIcon,
  Phone
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

/* --- DraggableStaff (Mobile Scroll Fix) --- */
const DraggableStaff = ({ id, staffMember, isOverlay = false, size = "normal", hideName = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(id),
    data: { staffMember },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging || isOverlay ? 9999 : 10,
  };

  const isMap = size === "map";
  const isSmall = size === "small";

  const containerClasses = isMap
    ? "w-full h-full"
    : (isSmall ? "w-10 h-10 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16");

  const textSize = isMap || isSmall ? "text-[8px] md:text-[9px]" : "text-[10px]";
  const borderClasses = isMap ? "" : "border-[2px] border-white shadow-sm";

  // Image Helper
  const fallbackImage = `https://ui-avatars.com/api/?name=${staffMember.name}&background=random&color=fff&bold=true`;
  const getImageUrl = (url) => {
    if (!url) return fallbackImage;
    if (url.startsWith("http:")) return url.replace("http:", "https:");
    return url.startsWith("http") ? url : fallbackImage;
  };

  const isOT = staffMember.isOvertime || staffMember.name.includes("(OT)");

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      // 👇 MAJOR CHANGE: 'touch-none' hataya, 'touch-manipulation' lagaya
      className={`flex flex-col items-center justify-center transition-transform touch-manipulation ${isOverlay ? 'scale-110 opacity-95 cursor-grabbing' : 'cursor-grab hover:scale-105 active:cursor-grabbing'
        } ${isMap ? 'w-full h-full p-[1px]' : ''}`}
    >
      <div className={`${containerClasses} ${borderClasses} rounded-full overflow-hidden bg-gray-200 transition-all relative`}>
        <img
          src={getImageUrl(staffMember.avatar)}
          alt={staffMember.name}
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
          className="w-full h-full object-cover pointer-events-none select-none bg-white"
        />
      </div>

      {!hideName && (
        <span className={`
          ${textSize} font-black absolute -bottom-2 px-2 py-0.5 rounded-full shadow-md border z-10 uppercase tracking-wider whitespace-nowrap
          ${isOT ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-gray-900 border-gray-200"}
        `}>
          {staffMember.name}
        </span>
      )}
    </div>
  );
};

/* --- DroppableZone --- */
const DroppableZone = ({ id, children, className, label, isAbsent = false, isAir = false, isSupervisor = false, isExtra = false, isPool = false }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  let activeClass = '';
  if (isOver) {
    if (isAbsent) activeClass = 'bg-red-100 border-red-500 ring-4 ring-red-200 scale-105';
    else if (isAir) activeClass = 'bg-cyan-100 border-cyan-500 scale-110 shadow-xl';
    else if (isSupervisor) activeClass = 'bg-purple-100 border-purple-500 scale-110 shadow-xl';
    else if (isExtra) activeClass = 'bg-orange-100 border-orange-500 scale-110 shadow-xl';
    else if (isPool) activeClass = 'bg-blue-100 border-blue-500 ring-4 ring-blue-200';
    else activeClass = 'bg-green-100 border-green-600 scale-105 shadow-xl';
  }

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all duration-200 flex items-center justify-center ${className} ${activeClass}`}
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [smsTime, setSmsTime] = useState({ morning: "05:00", evening: "14:00" });

  // UI & Data State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMemberListModal, setShowMemberListModal] = useState(false);

  // Drag State
  const [activeId, setActiveId] = useState(null);
  const [activeStaff, setActiveStaff] = useState(null);

  // Data State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('Morning');
  const [caption, setCaption] = useState("");
  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState({});

  // Image View/Save State
  const [savedMapImage, setSavedMapImage] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newMember, setNewMember] = useState({
    name: "", role: "operator", shift: 'morning', phoneNumber: "", available: 'present', file: null, preview: null
  });

  // Edit Button dabane par ye chalega
  const handleEditClick = (member) => {
    setEditingId(member.id); // Batao ki hum is ID ko edit kar rahe hain
    setNewMember({
      name: member.name,
      role: member.role,
      shift: member.shift,
      phoneNumber: member.phoneNumber || "",
      available: member.available || 'present',
      file: null,
      preview: getImageUrl(member.avatar) // Purani photo preview me dikhao
    });

    setShowMemberListModal(false); // List band karo
    setShowAddModal(true); // Form kholo
  };

  // --- SENSORS CONFIGURATION (Scroll vs Drag Logic) ---
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 }
    }),
    useSensor(TouchSensor, {
      // 👇 ISKO DHYAN SE DEKHEIN
      activationConstraint: {
        delay: 250,   // 250ms tak daba ke rakhne par hi Drag hoga
        tolerance: 5  // Agar bina hold kiye 5px hil gaya, to Drag cancel (Scroll shuru)
      }
    })
  );

  const getImageUrl = (url) => {
    if (!url) return null;
    // Cloudinary HTTP fix
    if (url.startsWith("http:")) {
      return url.replace("http:", "https:");
    }
    return url;
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get("/shifting");

        // Members ko format karein
        const formattedMembers = response.data.map(m => ({
          ...m, id: m._id, avatar: m.avatar || null
        }));

        setMembers(formattedMembers);

        // ✅ LOGIC: Database me jo 'absent' hain, unhe turant Absent Zone me daal do
        const dbAbsents = formattedMembers.filter(m => m.available === 'absent');

        setAssignments(prev => ({
          ...prev,
          absent: dbAbsents // Absent list pre-fill ho jayegi
        }));

      } catch (error) {
        console.error(error);
        toast.error("Failed to load members");
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveStaff(null);

    if (!over) return;

    const staffId = getCleanId(String(active.id));

    // Target normalize logic
    let targetZone = normalizeZone(String(over.id));
    if (String(over.id) === 'absent-mobile') targetZone = 'absent';
    if (String(over.id) === 'available-pool-mobile') targetZone = 'available-pool';

    const draggedStaff = members.find((s) => String(s.id) === staffId);
    if (!draggedStaff) return;

    // --- 🔒 CHECK: Current Status ---
    const isCurrentlyAbsent = assignments['absent']?.some(s => String(s.id) === staffId);


    // --- 1. ABSENT LOCK LOGIC (Agar Absent hai to sirf Pool me jayega) ---
    if (isCurrentlyAbsent) {
      if (targetZone !== 'available-pool' && targetZone !== 'absent') {
        toast.error("⚠️ Pehle Staff ko 'Available Pool' mein wapas laayein!");
        return;
      }
    }

    // --- 2. ROLE VALIDATION (Supervisor/AirBoy Logic) ---
    if (targetZone !== 'available-pool' && targetZone !== 'absent') {
      const role = draggedStaff.role.toLowerCase();
      if (role === 'supervisor' && targetZone !== 'Supervisor') {
        toast.warning("🚫 Supervisor can only be assigned to Supervisor Desk!");
        return;
      }
      if (role === 'air boy' && targetZone !== 'Air') {
        toast.warning("🚫 Air Boy can only be assigned to Air Zone!");
        return;
      }
    }

    // --- 3. UI STATE UPDATE (Turant dikhane ke liye) ---
    setAssignments((prev) => {
      const newAssignments = { ...prev };

      // Remove from old
      if (Array.isArray(newAssignments['absent'])) {
        newAssignments['absent'] = newAssignments['absent'].filter((s) => String(s.id) !== staffId);
      }
      Object.keys(newAssignments).forEach((key) => {
        if (key !== 'absent' && newAssignments[key]?.id && String(newAssignments[key].id) === staffId) {
          newAssignments[key] = null;
        }
      });

      // Add to new
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

    // --- 4. 💾 DATABASE UPDATE LOGIC (Persistence) ---

    try {
      // Case A: Agar ABSENT me daala hai -> DB me 'absent' mark karo
      if (targetZone === 'absent' && !isCurrentlyAbsent) {
        await axiosInstance.put(`/shifting/${staffId}`, { available: 'absent' });

        // Local Members state bhi update karein taaki Available pool se gayab ho jaye
        setMembers(prev => prev.map(m => m.id === staffId ? { ...m, available: 'absent' } : m));
        toast.info(`${draggedStaff.name} marked as Absent`);
      }

      // Case B: Agar ABSENT se wapas POOL me laye -> DB me 'present' mark karo
      else if (targetZone === 'available-pool' && isCurrentlyAbsent) {
        await axiosInstance.put(`/shifting/${staffId}`, { available: 'present' });

        // Local Members state update
        setMembers(prev => prev.map(m => m.id === staffId ? { ...m, available: 'present' } : m));
        toast.success(`${draggedStaff.name} marked as Present`);
      }

    } catch (error) {
      console.error("Status Update Failed", error);
      toast.error("Failed to update status in Database");
    }
  };

  const handleSaveImage = async () => {
    if (!pumpMapRef.current) return;

    const toastId = toast.loading("Generating High-Quality Map...");

    try {
      // 1. Create Sandbox (Canvas Container)
      const sandbox = document.createElement("div");
      const BASE_SIZE = 1200;

      sandbox.style.position = "absolute";
      sandbox.style.top = "-10000px";
      sandbox.style.left = "-10000px";
      sandbox.style.width = `${BASE_SIZE}px`;
      sandbox.style.backgroundColor = "#f8fafc";
      sandbox.style.fontFamily = "sans-serif";
      sandbox.style.display = "flex";
      sandbox.style.flexDirection = "column";
      sandbox.style.alignItems = "center";
      sandbox.style.padding = "40px";
      sandbox.style.boxSizing = "border-box";
      document.body.appendChild(sandbox);

      // --- 2. HEADER ---
      const headerDiv = document.createElement("div");
      Object.assign(headerDiv.style, {
        width: "100%",
        marginBottom: "40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "4px solid #e2e8f0",
        paddingBottom: "20px"
      });

      headerDiv.innerHTML = `
        <div>
          <h1 style="margin:0; font-size: 36px; font-weight: 900; color: #1e293b; letter-spacing: 1px;">PUMP MANAGER</h1>
          <span style="font-size: 16px; color: #64748b; font-weight: 600;">SHIFT REPORT</span>
        </div>
        <div style="text-align: right;">
          <div style="background: #3b82f6; color: white; padding: 5px 15px; border-radius: 8px; font-weight: bold; display: inline-block; margin-bottom: 5px; text-transform: uppercase;">
            ${shift}
          </div>
          <div style="font-size: 20px; font-weight: 700; color: #334155;">
            📅 ${date}
          </div>
        </div>
      `;
      sandbox.appendChild(headerDiv);

      // --- 3. CLONE THE MAP & FIX IMAGES ---
      const originalNode = pumpMapRef.current;
      const clonedNode = originalNode.cloneNode(true);

      // Reset Clone Styles
      Object.assign(clonedNode.style, {
        transform: "scale(1)",
        width: "100%",
        height: "auto",
        boxShadow: "none",
        border: "none",
        margin: "0",
        padding: "40px 20px",
        overflow: "visible",
        background: "white",
        borderRadius: "30px",
        border: "2px solid #e2e8f0"
      });

      const inputWrapper = clonedNode.querySelector("#caption-wrapper");
      if (inputWrapper) inputWrapper.remove();

      // 🔥🔥 CRITICAL CORS FIX 🔥🔥
      // Find all images inside the map (Supervisor, Nozzles, etc.)
      const allImages = clonedNode.querySelectorAll("img");

      allImages.forEach(img => {
        const src = img.src || "";

        // Agar image ui-avatars se hai (jo CORS error deti hai)
        if (src.includes("ui-avatars.com")) {
          // Image ka parent dhoondo
          const parent = img.parentElement;
          // Naam nikalo (alt text se ya src se)
          const nameMatch = src.match(/name=([^&]+)/);
          const name = nameMatch ? decodeURIComponent(nameMatch[1]) : "??";
          const initials = name.substring(0, 2).toUpperCase();

          // Image hatao
          img.remove();

          // HTML DIV banao (CSS Circle)
          const avatarDiv = document.createElement("div");
          Object.assign(avatarDiv.style, {
            width: "100%",
            height: "100%",
            backgroundColor: "#3b82f6", // Blue background
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            textTransform: "uppercase"
          });
          avatarDiv.innerText = initials;

          // Parent me daal do
          parent.appendChild(avatarDiv);
        } else {
          // Agar Cloudinary image hai, to crossOrigin allow karo
          img.crossOrigin = "anonymous";
        }
      });

      sandbox.appendChild(clonedNode);

      // --- 4. ABSENT SECTION (PURE CSS - NO IMAGES) ---
      const absentDiv = document.createElement("div");
      Object.assign(absentDiv.style, {
        width: "100%",
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#fff1f2",
        border: "2px dashed #fda4af",
        borderRadius: "20px",
        boxSizing: "border-box"
      });

      const absentMembers = assignments['absent'] || [];

      let absentHTML = `
        <h3 style="margin: 0 0 15px 0; color: #be123c; font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
          <span>🚫</span> ABSENT STAFF (${absentMembers.length})
        </h3>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      `;

      if (absentMembers.length > 0) {
        absentMembers.forEach(m => {
          // Absent walo ke liye bhi hum CSS Circle use karenge
          // Taaki 'ui-avatars' fetch hi na karna pade
          let avatarHTML = "";

          if (m.avatar && m.avatar.startsWith("http") && !m.avatar.includes("ui-avatars")) {
            // Real photo (Cloudinary)
            const safeUrl = m.avatar.replace("http:", "https:");
            avatarHTML = `<img src="${safeUrl}" crossorigin="anonymous" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;" />`;
          } else {
            // CSS Circle (Initials)
            const initials = m.name.substring(0, 2).toUpperCase();
            avatarHTML = `
               <div style="width: 30px; height: 30px; border-radius: 50%; background-color: #ef4444; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px;">
                 ${initials}
               </div>
             `;
          }

          absentHTML += `
            <div style="display: flex; align-items: center; gap: 10px; background: white; padding: 8px 15px; border-radius: 50px; border: 1px solid #fecdd3;">
              ${avatarHTML}
              <span style="font-weight: 700; color: #9f1239; font-size: 14px; text-transform: uppercase;">${m.name}</span>
            </div>
          `;
        });
      } else {
        absentHTML += `<span style="color: #059669; font-weight: 700; font-size: 16px;">✅ Everyone is Present!</span>`;
      }

      absentHTML += `</div>`;
      absentDiv.innerHTML = absentHTML;
      sandbox.appendChild(absentDiv);

      // --- 5. CAPTION ---
      if (caption) {
        const captionDiv = document.createElement("div");
        captionDiv.innerText = caption;
        Object.assign(captionDiv.style, {
          width: "100%",
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f1f5f9",
          borderRadius: "15px",
          color: "#475569",
          fontSize: "20px",
          fontWeight: "600",
          textAlign: "center",
          border: "1px solid #cbd5e1"
        });
        sandbox.appendChild(captionDiv);
      }

      // --- 6. CAPTURE ---
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(sandbox, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#f8fafc",
        windowWidth: 1200,
        logging: false
      });

      document.body.removeChild(sandbox);

      // Save JPEG (Compressed)
      const base64Image = canvas.toDataURL("image/jpeg", 0.7);

      const link = document.createElement("a");
      link.download = `Pump_Map_${date}_${shift}.jpg`;
      link.href = base64Image;
      link.click();

      // Backend Save
      await axiosInstance.post("/save-map", { date, shift, image: base64Image, caption, assignments: assignments });
      setSavedMapImage(base64Image);
      toast.update(toastId, { render: "Map Saved Successfully!", type: "success", isLoading: false, autoClose: 3000 });

    } catch (err) {
      console.error("Save Error:", err);
      toast.update(toastId, { render: "Failed to Save (Check Console)", type: "error", isLoading: false, autoClose: 3000 });
    }
  };
  const handleAutoAssign = () => {
    // 1. Absent IDs nikalein
    const absentIds = (assignments['absent'] || []).map(m => m.id);

    // 2. Available Staff Filter karein
    const allAvailable = members.filter(m => m.available === 'present' && !absentIds.includes(m.id));

    if (allAvailable.length === 0) {
      toast.warning("No staff available to assign!");
      return;
    }

    // 3. Shuffle Helper
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    // 4. Queue Banayein
    const getShiftQueue = (role) => {
      const roleMembers = allAvailable.filter(m => m.role.toLowerCase() === role);

      // Same Shift (Priority)
      const sameShift = roleMembers.filter(m => m.shift.toLowerCase() === shift.toLowerCase());

      // Other Shift (Overtime)
      const otherShift = roleMembers.filter(m => m.shift.toLowerCase() !== shift.toLowerCase()).map(m => ({
        ...m,
        name: `${m.name} (OT)`,
        isOvertime: true
      }));

      return {
        primary: shuffle(sameShift), // Current Shift
        backup: shuffle(otherShift)  // OT Shift
      };
    };

    // 5. Role Queues Taiyar karein
    const supervisors = getShiftQueue('supervisor');
    const airBoys = getShiftQueue('air boy');
    const operators = getShiftQueue('operator');

    // 6. Reset Assignments
    const newAssigns = { ...assignments };
    const slotsToFill = ['Supervisor', 'Air', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'Extra'];
    slotsToFill.forEach(key => newAssigns[key] = null);

    // --- ASSIGNMENT PROCESS ---

    // A. Assign Supervisor
    if (supervisors.primary.length > 0) newAssigns['Supervisor'] = supervisors.primary.shift();
    else if (supervisors.backup.length > 0) newAssigns['Supervisor'] = supervisors.backup.shift();

    // B. Assign Air Boy
    if (airBoys.primary.length > 0) newAssigns['Air'] = airBoys.primary.shift();
    else if (airBoys.backup.length > 0) newAssigns['Air'] = airBoys.backup.shift();

    // --- C. OPERATOR LOGIC (Special Hanging Rule) ---

    // Rule: Hanging (N5) par Current Shift ka banda zaroori hai agar available hai.
    // Isliye sabse pehle N5 ko fill karenge Primary queue se.

    if (operators.primary.length > 0) {
      newAssigns['N5'] = operators.primary.shift(); // Hanging 1 (Reserved for Current Shift)
    } else if (operators.backup.length > 0) {
      newAssigns['N5'] = operators.backup.shift(); // Agar Primary hai hi nahi to majboori me OT
    }

    // Ab baaki slots fill karenge (N1, N2, N3, N4, N6)
    // N5 already fill ho chuka hai upar
    const remainingSlots = ['N1', 'N2', 'N3', 'N4', 'N6'];

    remainingSlots.forEach(slot => {
      // Step 1: Try Current Shift
      if (operators.primary.length > 0) {
        newAssigns[slot] = operators.primary.shift();
      }
      // Step 2: Use Overtime (Backup)
      else if (operators.backup.length > 0) {
        newAssigns[slot] = operators.backup.shift();
      }
    });

    // D. Assign Extra (STRICT RULE: NO OVERTIME)
    if (operators.primary.length > 0) {
      newAssigns['Extra'] = operators.primary.shift();
    }

    setAssignments(newAssigns);
    toast.success(`Auto-assigned for ${shift}!`);
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!newMember.name) return;

    try {
      const formData = new FormData();
      formData.append("name", newMember.name);
      formData.append("role", newMember.role);
      formData.append("shift", newMember.shift);
      formData.append("phoneNumber", newMember.phoneNumber);
      formData.append("available", newMember.available || 'present');

      // Agar nayi file select ki hai tabhi bhejo
      if (newMember.file) {
        formData.append("avatar", newMember.file);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingId) {
        // --- UPDATE LOGIC (PUT) ---
        // Backend route: router.put("/shifting/:id", ...) hona chahiye
        const response = await axiosInstance.put(`/shifting/${editingId}`, formData, config);

        // Local state update karo (Page refresh ki zarurat nahi)
        setMembers(members.map(m =>
          m.id === editingId
            ? { ...response.data, id: response.data._id, avatar: response.data.avatar }
            : m
        ));
        toast.success("Member Updated Successfully!");
      } else {
        // --- ADD LOGIC (POST) ---
        const response = await axiosInstance.post("/shifting", formData, config);

        const saved = {
          ...response.data,
          id: response.data._id,
          avatar: response.data.avatar
        };
        setMembers([...members, saved]);
        toast.success("Member Added Successfully!");
      }

      // Form & State Reset
      setNewMember({ name: "", phoneNumber: "", role: "operator", shift: "morning", available: "present", file: null, preview: null });
      setEditingId(null); // Edit mode band karo
      setShowAddModal(false);

    } catch (error) {
      console.error(error);
      toast.error(editingId ? "Failed to Update" : "Failed to Add");
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewMember(prev => ({
      ...prev,
      file: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleDeleteMember = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-gray-800">Delete this member?</p>

          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                try {
                  await axiosInstance.delete(`/shifting/${id}`);
                  setMembers(prev => prev.filter(m => m.id !== id));
                  toast.success("Member Deleted");
                } catch {
                  toast.error("Failed to delete");
                }
                closeToast();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
            >
              Yes
            </button>

            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-200 rounded-md text-sm"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
      }
    );
  };

  const handleSubmitReport = () => {
    let message = `*⛽ Petrol Pump Shift Report*\n📅 Date: ${date}\n🕒 Shift: ${shift}\n\n*Assignments:*\n`;
    const mapLabels = {
      'Supervisor': '👮 Supervisor',
      'N1': '⛽ Nozzle 1', 'N2': '⛽ Nozzle 2', 'N3': '⛽ Nozzle 3', 'N4': '⛽ Nozzle 4',
      'N5': '🪝 Hanging 5', 'N6': '🪝 Hanging 6',
      'Extra': '👷 Extra', 'Air': '💨 Air Boy'
    };
    Object.entries(mapLabels).forEach(([key, label]) => {
      const staff = assignments[key];
      message += `${label}: ${staff ? staff.name : '❌ Empty'}\n`;
    });
    const absentNames = assignments['absent']?.map((s) => s.name).join(', ');
    if (absentNames) message += `\n⚠️ *Absent:* ${absentNames}`;
    if (caption) message += `\n📝 *Note:* ${caption}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Open Modal & Fetch Current Time
  const handleOpenSettings = async () => {
    setShowSettingsModal(true); // Modal turant kholo
    try {
      const res = await axiosInstance.get("/settings");
      if (res.data) {
        setSmsTime({
          morning: res.data.morningTime || "05:00",
          evening: res.data.eveningTime || "14:00"
        });
      }
      setShowSettingsModal(true);
    } catch (err) {
      toast.error("Failed to load settings");
    }
  };

  // Save New Time
  const handleSaveSettings = async () => {
    try {
      await axiosInstance.post("/settings", {
        morningTime: smsTime.morning,
        eveningTime: smsTime.evening
      });
      toast.success("SMS Schedule Updated!");
      setShowSettingsModal(false);
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden text-gray-900">

      {/* HEADER (mobile) */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg shrink-0 z-30">
        <div className="flex items-center gap-4">
          <div onClick={() => setIsSidebarOpen(true)}><Menu size={28} /></div>
          <h1 className="text-xl font-black tracking-wider uppercase">Pump Manager</h1>
        </div>
      </header>

      {/* SIDEBAR OVERLAY (mobile) */}
      {isSidebarOpen && (
        <div className="md:hidden absolute inset-0 z-50 flex">
          <div className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-left">
            <div className="flex justify-between items-center border-b-4 border-slate-800 pb-2">
              <h2 className="text-2xl font-black text-slate-800">MENU</h2>
              <div onClick={() => setIsSidebarOpen(false)}><X className="text-red-600" /></div>
            </div>
            <div onClick={() => { setShowAddModal(true); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-gray-700"><Users /> Add Member</div>
            <div onClick={() => { setShowMemberListModal(true); setIsSidebarOpen(false); }} className="flex items-center gap-4 text-lg font-bold text-gray-700"><FileText /> Member List</div>
            <div onClick={() => navigate('/allshifting')} className="flex items-center gap-4 text-lg font-bold text-gray-700"><Calendar /> All Reports</div>
            <div onClick={handleOpenSettings} className="flex items-center gap-4 text-lg font-bold text-gray-700 cursor-pointer">
              <SettingsIcon /> SMS Settings
            </div>
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-2xl z-40">
            <div className="p-6 border-b border-slate-700 flex items-center gap-3">
              <LayoutDashboard size={28} className="text-blue-400" />
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
              <div onClick={handleOpenSettings} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition text-gray-300 hover:text-white font-bold cursor-pointer">
                <SettingsIcon size={20} />Setting
              </div>
            </nav>
          </aside>

          {/* CENTER AREA */}
          <div className="flex-1 flex flex-col bg-slate-100 relative h-full overflow-hidden">
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
                  <div key={s} onClick={() => setShift(s)} className={`flex-1 py-3 rounded-xl text-center text-lg font-black uppercase tracking-wider transition-all ${shift === s ? 'bg-blue-700 text-white shadow-lg' : 'text-gray-400'}`}>{s}</div>
                ))}
              </div>
              <div className="flex gap-3">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-xl p-3 text-gray-700 font-bold outline-none shadow-sm" />
                <button onClick={handleAutoAssign} className="bg-orange-500 text-white px-5 py-3 rounded-xl shadow-lg font-bold"><RefreshCw size={18} /></button>
              </div>
            </div>

            {/* MAP AREA */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="min-h-full flex flex-col items-center justify-center py-10 pb-40 md:pb-10">

                {/* THE MAP CARD */}
                <div id="pump-map-container" ref={pumpMapRef} className="bg-white rounded-[2rem] shadow-xl border-[4px] border-slate-200 p-4 md:p-8 pb-12 relative flex flex-col items-center justify-center w-full max-w-[360px] md:max-w-none md:w-auto scale-95 md:scale-100">

                  {/* Title inside Card */}
                  <div className="absolute top-3 w-full text-center">
                    <h3 className="text-slate-300 text-[9px] font-black uppercase tracking-[0.3em]">Pump Map</h3>
                  </div>

                  {/* Supervisor */}
                  <div className="absolute top-4 left-4 z-20">
                    <DroppableZone id="Supervisor" label="Supervisor" isSupervisor={true} className="w-16 h-16 md:w-20 md:h-20 bg-purple-50 rounded-full border-[3px] border-purple-200 flex items-center justify-center relative shadow-sm">
                      <ShieldCheck className="absolute text-purple-200 w-6 h-6 md:w-8 md:h-8 z-0" />
                      {assignments['Supervisor'] && <DraggableStaff id={assignments['Supervisor'].id} staffMember={assignments['Supervisor']} size="map" />}
                    </DroppableZone>
                  </div>

                  {/* Layout Container */}
                  <div className="mt-10 md:mt-8 flex gap-3 md:gap-8 items-center">
                    {/* LEFT SIDE */}
                    <div className="relative p-2 md:p-4">
                      <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-[2rem] -z-10"></div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-x-24 md:gap-y-24 relative z-10 p-2">
                        <DroppableZone id="N2" label="Nozzle 2" className="w-16 h-16 md:w-24 md:h-24 bg-blue-50 rounded-full border-[3px] border-blue-200 flex items-center justify-center shadow-md">
                          {assignments['N2'] && <DraggableStaff id={assignments['N2'].id} staffMember={assignments['N2']} size="map" />}
                        </DroppableZone>
                        <DroppableZone id="N1" label="Nozzle 1" className="w-16 h-16 md:w-24 md:h-24 bg-blue-50 rounded-full border-[3px] border-blue-200 flex items-center justify-center shadow-md">
                          {assignments['N1'] && <DraggableStaff id={assignments['N1'].id} staffMember={assignments['N1']} size="map" />}
                        </DroppableZone>
                        <DroppableZone id="N3" label="Nozzle 3" className="w-16 h-16 md:w-24 md:h-24 bg-blue-50 rounded-full border-[3px] border-blue-200 flex items-center justify-center shadow-md">
                          {assignments['N3'] && <DraggableStaff id={assignments['N3'].id} staffMember={assignments['N3']} size="map" />}
                        </DroppableZone>
                        <DroppableZone id="N4" label="Nozzle 4" className="w-16 h-16 md:w-24 md:h-24 bg-blue-50 rounded-full border-[3px] border-blue-200 flex items-center justify-center shadow-md">
                          {assignments['N4'] && <DraggableStaff id={assignments['N4'].id} staffMember={assignments['N4']} size="map" />}
                        </DroppableZone>
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-28 md:h-28 bg-slate-800 rounded-xl md:rounded-2xl shadow-2xl flex flex-col items-center justify-center border-2 md:border-4 border-slate-600 z-0">
                        <span className="text-lg md:text-2xl font-black text-white tracking-widest">MPD</span>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col gap-3 md:gap-5 border-l-2 border-dashed border-slate-200 pl-3 md:pl-8 py-2">
                      <DroppableZone id="N5" label="H-5" className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-full border-[3px] border-indigo-200 flex items-center justify-center shadow-sm">
                        {assignments['N5'] && <DraggableStaff id={assignments['N5'].id} staffMember={assignments['N5']} size="map" />}
                      </DroppableZone>
                      <DroppableZone id="N6" label="H-6" className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-full border-[3px] border-indigo-200 flex items-center justify-center shadow-sm">
                        {assignments['N6'] && <DraggableStaff id={assignments['N6'].id} staffMember={assignments['N6']} size="map" />}
                      </DroppableZone>
                      <div className="mt-1">
                        <DroppableZone id="Extra" label="Extra" isExtra={true} className="w-16 h-16 md:w-20 md:h-20 bg-orange-50 rounded-full border-[3px] border-orange-200 flex items-center justify-center relative shadow-sm">
                          <UserPlus className="absolute text-orange-200 w-6 h-6 md:w-8 md:h-8 z-0" />
                          {assignments['Extra'] && <DraggableStaff id={assignments['Extra'].id} staffMember={assignments['Extra']} size="map" />}
                        </DroppableZone>
                      </div>
                      <div className="mt-1">
                        <DroppableZone id="Air" label="Air Boy" isAir={true} className="w-16 h-16 md:w-20 md:h-20 bg-cyan-50 rounded-full border-[3px] border-cyan-200 flex items-center justify-center relative shadow-sm">
                          <Wind className="absolute text-cyan-200 w-6 h-6 md:w-8 md:h-8 z-0" />
                          {assignments['Air'] && <DraggableStaff id={assignments['Air'].id} staffMember={assignments['Air']} size="map" />}
                        </DroppableZone>
                      </div>
                    </div>
                  </div>

                  {/* Caption Input */}
                  <div id="caption-wrapper" className="mt-6 mb-2 w-full flex justify-center px-4">
                    <Edit3 size={16} className="text-slate-400 shrink-0" />
                    <input
                      id="caption-input"
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a note/caption here..."
                      className="w-full bg-slate-50 px-3 py-2 rounded-lg outline-none font-bold text-slate-600 text-xs md:text-sm text-center border border-slate-100"
                    />
                  </div>

                </div>

                {/* Mobile Absent Zone & Buttons Container */}
                <div className="md:hidden w-full max-w-[360px] mt-6 mb-32"> {/* <--- Added mb-32 here */}

                  {/* Absent Zone Header */}
                  <div className="flex items-center gap-1 mb-1 ml-1 text-xs font-black text-red-400 uppercase">
                    <AlertCircle size={12} /> Absent Zone
                  </div>

                  {/* Absent Zone Box */}
                  <DroppableZone id="absent-mobile" isAbsent={true} className="w-full bg-red-50 border-4 border-dashed border-red-200 rounded-2xl p-2 min-h-[70px] flex items-center gap-2 overflow-x-auto px-4">
                    {absentStaff.length === 0 && <span className="text-red-300 w-full text-center font-bold uppercase text-[10px]">Drag Absent Staff Here</span>}
                    {absentStaff.map((s) => (
                      <div key={s.id} className="shrink-0">
                        <DraggableStaff id={`mob-${s.id}`} staffMember={s} size="small" hideName={true} />
                      </div>
                    ))}
                  </DroppableZone>

                  {/* Mobile Save Button */}
                  <button onClick={handleSaveImage} className="md:hidden flex items-center gap-2 text-blue-600 font-bold bg-white px-6 py-3 rounded-xl shadow border border-blue-100 hover:bg-blue-50 text-sm mt-4 w-full max-w-[360px] justify-center">
                    <Download size={18} /> Save Map Image
                  </button>

                  {/* Mobile VIEW Saved Button */}
                  {savedMapImage && (
                    <button onClick={() => setViewMode(true)} className="md:hidden flex items-center gap-2 text-green-600 font-bold bg-white px-6 py-3 rounded-xl shadow border border-green-100 hover:bg-green-50 text-sm mt-2 w-full max-w-[360px] justify-center">
                      <FileText size={18} /> View Saved Map
                    </button>
                  )}

                </div>


              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (DESKTOP) */}
          <aside className="hidden md:flex flex-col w-[300px] bg-white border-l border-gray-200 shadow-xl z-30">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">Staffs</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Available Pool */}
              <div>
                <h4 className="text-[10px] font-bold text-green-600 uppercase mb-2 flex items-center gap-2"><Users size={12} /> Available ({availableStaff.length})</h4>
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
                <h4 className="text-[10px] font-bold text-red-500 uppercase mb-2 flex items-center gap-2"><AlertCircle size={12} /> Absent / Leave</h4>
                <DroppableZone id="absent" isAbsent={true} className="bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-2 min-h-[100px] flex flex-wrap gap-2 content-start">
                  {absentStaff.length === 0 && <span className="text-red-300 w-full text-center mt-6 font-bold text-[10px]">Drop Absent Staff Here</span>}
                  {absentStaff.map((s) => <DraggableStaff key={s.id} id={`desk-${s.id}`} staffMember={s} size="small" hideName={true} />)}
                </DroppableZone>
              </div>

              <button onClick={handleSaveImage} className="w-full flex items-center justify-center gap-2 text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 py-3 rounded-xl border border-blue-200 transition-colors text-sm">
                <Download size={16} /> Save Map Image
              </button>

              {savedMapImage && (
                <button onClick={() => setViewMode(true)} className="w-full flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 hover:bg-green-100 py-3 rounded-xl border border-green-200 transition-colors text-sm">
                  <FileText size={16} /> View Saved Map
                </button>
              )}
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
              </p>
              <DroppableZone id="available-pool-mobile" isPool={true} className="flex gap-3 overflow-x-auto pb-4 min-h-[70px] items-center px-2 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
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

      {/* VIEW IMAGE MODAL */}
      {viewMode && savedMapImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4" onClick={() => setViewMode(false)}>
          <div className="relative max-w-4xl w-full max-h-screen overflow-auto bg-white rounded-xl p-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewMode(false)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full z-10 shadow-lg hover:bg-red-600"><X size={20} /></button>
            <img src={savedMapImage} alt="Saved Map" className="w-full h-auto object-contain" />
            <div className="text-center p-2 font-bold uppercase text-gray-600 text-sm">
              Saved Map: {date} ({shift})
            </div>
          </div>
        </div>
      )}

      {/* MODALS (Add/List) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xl font-black text-blue-900 mb-4">ADD NEW STAFF</h2>
            <form onSubmit={handleAddMemberSubmit} className="flex flex-col gap-4">
              <div className="flex justify-center">
                <label className="relative w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 overflow-hidden bg-gray-50">
                  {newMember.preview ? (
                    <img
                      src={newMember.preview}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 text-center">
                      Tap to<br />Upload
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <input type="text" placeholder="Name" className="bg-gray-100 p-3 rounded-xl font-bold outline-none focus:ring-2 ring-blue-500" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
              <input
                type="tel"
                placeholder="Phone (+91...)"
                className="bg-gray-100 p-3 rounded-xl font-bold outline-none focus:ring-2 ring-blue-500"
                value={newMember.phoneNumber}
                onChange={e => setNewMember({ ...newMember, phoneNumber: e.target.value })}
              />
              <div className="flex gap-2">
                <select className="bg-gray-100 p-3 rounded-xl flex-1 font-bold text-sm" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })}><option value="operator">Operator</option><option value="supervisor">Supervisor</option><option value="air boy">Air Boy</option></select>
                <select className="bg-gray-100 p-3 rounded-xl flex-1 font-bold text-sm" value={newMember.shift} onChange={e => setNewMember({ ...newMember, shift: e.target.value })}><option value="morning">Morning</option><option value="evening">Evening</option></select>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="relative bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <Users className="text-blue-600" size={22} />
                  TEAM MEMBERS
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Manage your shift staff ({members.length})
                </p>
              </div>

              <button
                onClick={() => setShowMemberListModal(false)}
                className="bg-white p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 shadow-sm transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable List Area */}
            <div className="overflow-y-auto flex-1 p-4 space-y-3 bg-[#FAFAFA]">

              {members.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-48 text-center opacity-60">
                  <Users size={48} className="text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-400">No staff added yet.</p>
                </div>
              ) : (
                /* Member Cards */
                members.map((m) => (
                  <div
                    key={m.id}
                    className="group relative flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                  >
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-4 overflow-hidden">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-blue-100 to-white shadow-sm">
                          <img
                            src={getImageUrl(m.avatar)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${m.name}&background=random`;
                            }}
                            className="w-full h-full rounded-full object-cover bg-slate-100"
                            alt={m.name}
                          />
                        </div>
                        {/* Green Dot */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>

                      {/* Text Info */}
                      <div className="flex flex-col min-w-0 gap-0.5">
                        <h3 className="font-bold text-slate-800 text-sm truncate">{m.name}</h3>

                        {/* 👇 PHONE NUMBER DISPLAY 👇 */}
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Phone size={12} className="text-slate-400" />
                          <span>{m.phoneNumber || "No Phone"}</span>
                        </div>

                        {/* Role Badge */}
                        <div className="flex items-center mt-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${m.role === 'supervisor' ? 'bg-purple-100 text-purple-600' :
                            m.role === 'air boy' ? 'bg-cyan-100 text-cyan-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                            {m.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions (Edit & Delete) */}
                    <div className="flex items-center gap-2">

                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => handleEditClick(m)}
                        className="p-2.5 rounded-xl text-slate-400 bg-slate-50 hover:text-blue-600 hover:bg-blue-100 border border-transparent hover:border-blue-200 transition-all duration-200"
                        title="Edit Member"
                      >
                        <Edit3 size={18} />
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        className="p-2.5 rounded-xl text-slate-400 bg-slate-50 hover:text-red-600 hover:bg-red-100 border border-transparent hover:border-red-200 transition-all duration-200"
                        title="Delete Member"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Footer Hint */}
            <div className="p-3 bg-white border-t border-slate-100 text-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Scroll to see more
              </p>
            </div>

          </div>
        </div>
      )}

      {/* --- SETTINGS MODAL --- */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <SettingsIcon className="text-blue-600" /> SMS TIMING
              </h2>
              <button onClick={() => setShowSettingsModal(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:text-red-500"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Morning SMS Time</label>
                <input
                  type="time"
                  value={smsTime.morning}
                  onChange={(e) => setSmsTime({ ...smsTime, morning: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Evening SMS Time</label>
                <input
                  type="time"
                  value={smsTime.evening}
                  onChange={(e) => setSmsTime({ ...smsTime, evening: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg mt-2 transition-transform active:scale-95"
              >
                Update Schedule
              </button>
            </div>
            <div className="mt-4 border-t pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Debug Actions</p>
              <button
                onClick={async () => {
                  try {
                    await axiosInstance.post("/test-sms", { shift: shift }); // Jo shift select hai uska SMS bhejega
                    toast.info("SMS Triggered! Check Logs.");
                  } catch (e) { toast.error("Failed to trigger"); }
                }}
                className="w-full bg-gray-800 hover:bg-black text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                🚀 Send Test SMS Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagementSystem;