import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axiosInstance from "../Dashboard/axiosInstance";
import BackButton from "../Home Page/backbutton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Fixed & cleaned version of your ShiftManagementSystemMobile component.
 * Key fixes:
 * - Removed top-level await / dynamic import moved to inside handler (no SSR/build break).
 * - DragDropContext wraps the interactive area (all Droppables/Draggables).
 * - Provided placeholder image URLs (use your PNGs from /public/assets by replacing these).
 * - Proper handling of present/absent lists, slot assignments, add/delete members, and submit/share flow.
 *
 * NOTE:
 * - For production builds on Vercel + Vite you should add this to vite.config.js:
 *   ssr: { noExternal: ["react-beautiful-dnd"] }
 * - Replace placeholder image URLs with your real /assets/*.png paths when ready.
 */

const fallbackPhoto = "https://via.placeholder.com/100?text=User";
const mpdImage = "https://via.placeholder.com/220x220?text=MPD";
const nozzleAssets = [
  "https://via.placeholder.com/80?text=N1",
  "https://via.placeholder.com/80?text=N2",
  "https://via.placeholder.com/80?text=N3",
  "https://via.placeholder.com/80?text=N4",
  "https://via.placeholder.com/80?text=N5",
  "https://via.placeholder.com/80?text=N6",
];

const ShiftManagementSystemMobile = () => {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [date, setDate] = useState("");
  const [members, setMembers] = useState([]);
  const [presentList, setPresentList] = useState([]);
  const [absentList, setAbsentList] = useState([]);
  const [slotAssignments, setSlotAssignments] = useState({
    nozzle1: null,
    nozzle2: null,
    nozzle3: null,
    nozzle4: null,
    nozzle5: null,
    nozzle6: null,
  });
  const [newMember, setNewMember] = useState({
    name: "",
    role: "operator",
    shift: "morning",
    available: "present",
    photo: "",
  });

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get("/shifting");
        const data = Array.isArray(res.data) ? res.data : [];
        setMembers(data);
        setAbsentList(data.filter((m) => m.available === "absent"));
        setPresentList(data.filter((m) => m.available === "present"));
      } catch (err) {
        console.error("fetchMembers error:", err);
        toast.warn("Failed to fetch members");
      }
    };
    fetchMembers();
  }, []);

  const getMemberById = (id) =>
    members.find((m) => m._id === id) || presentList.find((m) => m._id === id);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Present list -> slot (assign)
    if (source.droppableId === "present-list" && destination.droppableId.startsWith("slot-")) {
      const slotKey = destination.droppableId.replace("slot-", "nozzle");
      setSlotAssignments((prev) => {
        if (prev[slotKey] === draggableId) return prev; // no-op
        // remove from present list
        setPresentList((pl) => pl.filter((m) => m._id !== draggableId));
        // if slot occupied, put existing occupant back to present list
        const copy = { ...prev };
        const existing = copy[slotKey];
        if (existing) {
          const existingMember = getMemberById(existing);
          if (existingMember) setPresentList((pl) => [existingMember, ...pl]);
        }
        copy[slotKey] = draggableId;
        return copy;
      });
      return;
    }

    // Slot -> Present list (unassign)
    if (source.droppableId.startsWith("slot-") && destination.droppableId === "present-list") {
      const slotKey = source.droppableId.replace("slot-", "nozzle");
      setSlotAssignments((prev) => {
        const copy = { ...prev, [slotKey]: null };
        const movedMember = getMemberById(draggableId);
        if (movedMember) {
          setPresentList((pl) => {
            const arr = Array.from(pl);
            arr.splice(destination.index, 0, movedMember);
            return arr;
          });
        }
        return copy;
      });
      return;
    }

    // Slot -> Slot (swap)
    if (source.droppableId.startsWith("slot-") && destination.droppableId.startsWith("slot-")) {
      const srcKey = source.droppableId.replace("slot-", "nozzle");
      const dstKey = destination.droppableId.replace("slot-", "nozzle");
      setSlotAssignments((prev) => {
        const copy = { ...prev };
        const a = copy[srcKey];
        const b = copy[dstKey];
        copy[dstKey] = a;
        copy[srcKey] = b;
        return copy;
      });
      return;
    }

    // Reorder present list
    if (source.droppableId === "present-list" && destination.droppableId === "present-list") {
      const items = Array.from(presentList);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      setPresentList(items);
      return;
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) {
      toast.warn("Enter name");
      return;
    }
    try {
      const res = await axiosInstance.post("/shifting", newMember);
      const saved = res.data;
      setMembers((prev) => [...prev, saved]);
      if (saved.available === "present") setPresentList((p) => [saved, ...p]);
      else setAbsentList((a) => [saved, ...a]);
      setNewMember({ name: "", role: "operator", shift: "morning", available: "present", photo: "" });
      setShowAdd(false);
      toast.success("Member added");
    } catch (err) {
      console.error("add member error:", err);
      toast.warn("Failed to add");
    }
  };

  const handleRemoveMember = async (id) => {
    try {
      await axiosInstance.delete(`/shifting/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      setPresentList((prev) => prev.filter((m) => m._id !== id));
      setAbsentList((prev) => prev.filter((m) => m._id !== id));
      setSlotAssignments((prev) => {
        const copy = { ...prev };
        Object.keys(copy).forEach((k) => {
          if (copy[k] === id) copy[k] = null;
        });
        return copy;
      });
      toast.success("Deleted");
    } catch (err) {
      console.error("delete member err:", err);
      toast.warn("Delete failed");
    }
  };

  const handleSubmitAndShare = async () => {
    // prepare payload similar to original function
    const nozzleOrder = ["nozzle1", "nozzle2", "nozzle3", "nozzle4", "nozzle5", "nozzle6"];
    const assignedMembers = nozzleOrder.map((n) => getMemberById(slotAssignments[n]) || null);

    const payload = [
      {
        date,
        shiftType: "Mobile-Generated",
        startTime: "06:00",
        endTime: "23:00",
        supervisor: "Not Assigned",
        airBoy: "Not Assigned",
        extraOperator: "Not Assigned",
        nozzles: assignedMembers.map((m, idx) => ({
          nozzleNumber: `Nozzle ${idx + 1}`,
          member: m ? m.name : "Unassigned",
          overtime: false,
        })),
      },
    ];

    // post to server (best-effort; continue even on failure)
    try {
      await axiosInstance.post("/shiftingsavee", payload);
      toast.success("Shift data saved to server (attempted).");
    } catch (err) {
      console.warn("save shift data failed:", err);
      toast.warn("Failed to save shift data to server.");
    }

    // lazy-load html2canvas in browser only
    if (typeof window === "undefined" || !containerRef.current) {
      toast.warn("Unable to create screenshot here.");
      return;
    }

    try {
      const mod = await import("html2canvas");
      const html2canvas = mod.default || mod;
      const canvas = await html2canvas(containerRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `shift-${Date.now()}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Shift Assignment",
          text: `Shift assignments for ${date || "today"}`,
        });
        toast.success("Shared via native share (choose WhatsApp).");
        return;
      }

      // fallback: open image in new tab so user can long-press & share manually
      const imageWindow = window.open();
      if (imageWindow) {
        imageWindow.document.write(`<title>Shift Screenshot</title>`);
        imageWindow.document.write(`<img src="${dataUrl}" style="max-width:100%;height:auto"/>`);
        imageWindow.document.close();
        toast.info("Screenshot opened. Share it to WhatsApp group manually.");
        return;
      }

      // final fallback: open WhatsApp web with text summary
      const summary = assignedMembers.map((m, i) => `Nozzle ${i + 1}: ${m ? m.name : "Unassigned"}`).join("\n");
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`Shift (${date || "today"}):\n${summary}`)}`;
      window.open(waUrl, "_blank");
      toast.info("WhatsApp web opened to paste summary.");
    } catch (err) {
      console.error("screenshot/share error:", err);
      toast.warn("Unable to create screenshot for sharing. Ensure browser supports canvas & sharing.");
    }
  };

  // UI helpers
  const renderSlotInner = (slotKey) => {
    const memberId = slotAssignments[slotKey];
    if (!memberId) {
      // show nozzle asset if empty
      const idx = Number(slotKey.replace("nozzle", "")) - 1;
      return <img src={nozzleAssets[idx] || nozzleAssets[0]} alt={slotKey} className="w-10 h-10" />;
    }
    const member = getMemberById(memberId);
    if (!member) {
      const idx = Number(slotKey.replace("nozzle", "")) - 1;
      return <img src={nozzleAssets[idx] || nozzleAssets[0]} alt={slotKey} className="w-10 h-10" />;
    }
    return (
      <div className="flex items-center gap-2">
        <img src={member.photo || fallbackPhoto} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAdd(true)} className="p-2 bg-indigo-600 rounded-md text-white shadow">
            <FaPlus />
          </button>
          <div className="text-lg font-bold text-indigo-700">Shift Manager</div>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-slate-400" />
          <input
            className="text-sm outline-none bg-transparent"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* DragDropContext wraps interactive area */}
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Main container to screenshot (all droppables inside) */}
        <div ref={containerRef} className="bg-white rounded-xl p-3 shadow-md">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md flex items-center justify-center">
              {/* MPD */}
              <img src={mpdImage} alt="MPD" className="w-44 h-44 object-cover rounded-lg shadow-lg" />

              {/* Top-left nozzle 1 */}
              <div className="absolute left-6 -top-3 flex flex-col items-center">
                <Droppable droppableId="slot-nozzle1">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="w-20 h-20 rounded-full bg-white border flex items-center justify-center shadow cursor-pointer"
                    >
                      {slotAssignments.nozzle1 ? (
                        <Draggable draggableId={slotAssignments.nozzle1} index={0}>
                          {(drp) => (
                            <div
                              ref={drp.innerRef}
                              {...drp.draggableProps}
                              {...drp.dragHandleProps}
                              className="flex items-center gap-2"
                            >
                              <img
                                src={getMemberById(slotAssignments.nozzle1)?.photo || fallbackPhoto}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <>{renderSlotInner("nozzle1")}</>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="text-xs mt-1">Nozzle 1</div>
              </div>

              {/* Top-right nozzle 2 */}
              <div className="absolute right-6 -top-3 flex flex-col items-center">
                <Droppable droppableId="slot-nozzle2">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="w-20 h-20 rounded-full bg-white border flex items-center justify-center shadow cursor-pointer"
                    >
                      {slotAssignments.nozzle2 ? (
                        <Draggable draggableId={slotAssignments.nozzle2} index={0}>
                          {(drp) => (
                            <div ref={drp.innerRef} {...drp.draggableProps} {...drp.dragHandleProps}>
                              <img
                                src={getMemberById(slotAssignments.nozzle2)?.photo || fallbackPhoto}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <>{renderSlotInner("nozzle2")}</>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="text-xs mt-1">Nozzle 2</div>
              </div>

              {/* Bottom-left nozzle 3 */}
              <div className="absolute left-10 bottom-[-18px] flex flex-col items-center">
                <Droppable droppableId="slot-nozzle3">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="w-20 h-20 rounded-full bg-white border flex items-center justify-center shadow cursor-pointer"
                    >
                      {slotAssignments.nozzle3 ? (
                        <Draggable draggableId={slotAssignments.nozzle3} index={0}>
                          {(drp) => (
                            <div ref={drp.innerRef} {...drp.draggableProps} {...drp.dragHandleProps}>
                              <img
                                src={getMemberById(slotAssignments.nozzle3)?.photo || fallbackPhoto}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <>{renderSlotInner("nozzle3")}</>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="text-xs mt-1">Nozzle 3</div>
              </div>

              {/* Bottom-right nozzle 4 */}
              <div className="absolute right-10 bottom-[-18px] flex flex-col items-center">
                <Droppable droppableId="slot-nozzle4">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="w-20 h-20 rounded-full bg-white border flex items-center justify-center shadow cursor-pointer"
                    >
                      {slotAssignments.nozzle4 ? (
                        <Draggable draggableId={slotAssignments.nozzle4} index={0}>
                          {(drp) => (
                            <div ref={drp.innerRef} {...drp.draggableProps} {...drp.dragHandleProps}>
                              <img
                                src={getMemberById(slotAssignments.nozzle4)?.photo || fallbackPhoto}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <>{renderSlotInner("nozzle4")}</>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="text-xs mt-1">Nozzle 4</div>
              </div>

              {/* Right hanging column for nozzle 5 & 6 */}
              <div className="absolute right-[-60px] top-8 flex flex-col items-center gap-4">
                <Droppable droppableId="slot-nozzle5">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="w-16 h-16 rounded-full bg-white border flex items-center justify-center shadow cursor-pointer"
                    >
                      {slotAssignments.nozzle5 ? (
                        <Draggable draggableId={slotAssignments.nozzle5} index={0}>
                          {(drp) => (
                            <div ref={drp.innerRef} {...drp.draggableProps} {...drp.dragHandleProps}>
                              <img
                                src={getMemberById(slotAssignments.nozzle5)?.photo || fallbackPhoto}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <>{renderSlotInner("nozzle5")}</>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="text-xs">Nozzle 5</div>

                <Droppable droppableId="slot-nozzle6">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="w-16 h-16 rounded-full bg-white border flex items-center justify-center shadow cursor-pointer"
                    >
                      {slotAssignments.nozzle6 ? (
                        <Draggable draggableId={slotAssignments.nozzle6} index={0}>
                          {(drp) => (
                            <div ref={drp.innerRef} {...drp.draggableProps} {...drp.dragHandleProps}>
                              <img
                                src={getMemberById(slotAssignments.nozzle6)?.photo || fallbackPhoto}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <>{renderSlotInner("nozzle6")}</>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="text-xs">Nozzle 6</div>
              </div>
            </div>

            {/* Absent row */}
            <div className="mt-6 w-full">
              <div className="text-sm font-semibold mb-2">Absent</div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {absentList.length === 0 && <div className="text-xs text-gray-400">No absentees</div>}
                {absentList.map((a) => (
                  <div key={a._id} className="flex flex-col items-center text-xs bg-red-50 border rounded-md px-2 py-1">
                    <img src={a.photo || fallbackPhoto} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="mt-1 font-medium">{a.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Present list (source) */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Present (Drag to nozzle)</div>
              <div className="text-xs text-gray-400">Tap & hold to drag</div>
            </div>

            <Droppable droppableId="present-list" direction="horizontal">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex gap-3 overflow-x-auto pb-3">
                  {presentList.map((m, idx) => (
                    <Draggable key={m._id} draggableId={m._id} index={idx}>
                      {(dr) => (
                        <div
                          ref={dr.innerRef}
                          {...dr.draggableProps}
                          {...dr.dragHandleProps}
                          className="w-20 flex-shrink-0 bg-white border rounded-md p-2 flex flex-col items-center gap-1 shadow"
                          title={`${m.name} • ${m.role}`}
                        >
                          <img src={m.photo || fallbackPhoto} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                          <div className="text-xs text-center font-medium">{m.name.split(" ")[0]}</div>
                          <button
                            type="button"
                            className="text-red-500 text-xs mt-1"
                            onClick={() => handleRemoveMember(m._id)}
                          >
                            <IoTrashBinOutline />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Assigned summary */}
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Assigned Summary</div>
            <div className="grid grid-cols-2 gap-2">
              {["nozzle1", "nozzle2", "nozzle3", "nozzle4", "nozzle5", "nozzle6"].map((key, i) => {
                const mem = getMemberById(slotAssignments[key]);
                return (
                  <div key={key} className="p-2 bg-slate-50 rounded-md flex items-center gap-3">
                    <div className="text-xs w-24">Nozzle {i + 1}</div>
                    <div className="flex items-center gap-2">
                      <img src={mem?.photo || fallbackPhoto} alt={mem?.name || ""} className="w-8 h-8 rounded-full object-cover" />
                      <div className="text-xs">
                        <div className="font-medium">{mem ? mem.name : "Unassigned"}</div>
                        <div className="text-gray-400">{mem ? mem.role : ""}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Footer actions */}
      <div className="mt-4 flex gap-3">
        <button onClick={() => setShowAdd(true)} className="flex-1 bg-indigo-600 text-white py-3 rounded-md shadow">Add Member</button>
        <button onClick={handleSubmitAndShare} className="flex-1 bg-emerald-600 text-white py-3 rounded-md shadow">Submit & Share</button>
      </div>

      <div className="mt-4">
        <BackButton previousImage="/previous.png" />
      </div>

      {/* Add Member Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 z-10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold">Add Member</div>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-3">
              <input
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Name"
                className="w-full border rounded px-3 py-2"
              />
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="operator">Operator</option>
                <option value="supervisor">Supervisor</option>
                <option value="air boy">Air Boy</option>
              </select>
              <select
                value={newMember.shift}
                onChange={(e) => setNewMember({ ...newMember, shift: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
              <select
                value={newMember.available}
                onChange={(e) => setNewMember({ ...newMember, available: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              <input
                value={newMember.photo}
                onChange={(e) => setNewMember({ ...newMember, photo: e.target.value })}
                placeholder="Photo path (e.g. /assets/me.png)"
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded">Add</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 bg-gray-100 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagementSystemMobile;
