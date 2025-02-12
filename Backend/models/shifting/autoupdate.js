const cron = require("node-cron");
const ShiftHistory = require("./ShiftHistory");
const Member = require("../shifting/Members");

const autoAssignShifts = async () => {
  try {
    const members = await Member.find({ available: "present" });
    
    const todayDate = new Date().toISOString().split("T")[0]; // 📅 Current Date
    
    const morningMembers = members.filter(m => m.shift === "morning");
    const eveningMembers = members.filter(m => m.shift === "evening");

    // 📝 **Save Shift Assignments in DB with Date**
    for (const member of [...morningMembers, ...eveningMembers]) {
      const existingRecord = await ShiftHistory.findOne({ memberId: member._id, date: todayDate });

      if (existingRecord) {
        existingRecord.assignedCount += 1;
        await existingRecord.save();
      } else {
        await ShiftHistory.create({
          memberId: member._id,
          name: member.name,
          shift: member.shift,
          assignedCount: 1,
          date: todayDate,
        });
      }
    }

    console.log(`✅ Shift assigned for ${todayDate}`);
  } catch (error) {
    console.error("❌ Error in auto-assigning shifts:", error);
  }
};

// ⏰ **Auto-run every day at midnight**
cron.schedule("0 0 * * *", () => {
  console.log("🔄 Running auto shift assignment...");
  autoAssignShifts();
});
