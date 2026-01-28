const cron = require('node-cron');
const twilio = require('twilio');
const MapSnapshot = require('./MapSnapshot'); 
const Member = require('./Members');        
const Settings = require('./Settings');    
require('dotenv').config(); 

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

let morningTask = null;
let eveningTask = null;

// --- MESSAGE FORMATTER FUNCTION ---
function formatAssignmentMessage(date, shift, assignments, caption) {
    let msg = `⛽ *PUMP DUTY LIST*\n📅 ${date} (${shift})\n\n`;

    const labels = {
        'Supervisor': '👮 Supervisor',
        'N1': '⛽ Nozzle 1', 'N2': '⛽ Nozzle 2', 'N3': '⛽ Nozzle 3', 'N4': '⛽ Nozzle 4',
        'N5': '🪝 Nozzle 5', 'N6': '🪝 Nozzle 6',
        'Extra': '👷 Extra', 'Air': '💨 Air Boy'
    };

    Object.keys(labels).forEach(key => {
        const staff = assignments[key];
        if (staff && staff.name) {
            msg += `${labels[key]}: ${staff.name}\n`;
        } else {
            msg += `${labels[key]}: ❌ Empty\n`;
        }
    });

    if (assignments.absent && assignments.absent.length > 0) {
        const absentNames = assignments.absent.map(m => m.name).join(', ');
        msg += `\n🚫 Absent: ${absentNames}`;
    }

    if (caption) msg += `\n\n📝 Note: ${caption}`;
    
    return msg;
}

// --- SEND LOGIC ---
async function sendShiftReport(shiftName) {
    try {
        
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        
        const report = await MapSnapshot.findOne({ date: dateString, shift: shiftName });

        if (!report || !report.assignments) {
            console.log(`⚠️ No data found for ${shiftName}. Save the map first!`);
            return;
        }

        // Format Message
        const messageBody = formatAssignmentMessage(dateString, shiftName, report.assignments, report.caption);

        // Fetch Staff Numbers
        const members = await Member.find({}); 
        
        // Send SMS Loop
        for (const member of members) {
            if (member.phoneNumber) {
                try {
                    await client.messages.create({
                        body: messageBody,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: member.phoneNumber
                    });
                    console.log(`✅ SMS Sent to ${member.name}`);
                } catch (err) {
                    console.error(`❌ Failed: ${member.name} - ${err.message}`);
                }
            }
        }

    } catch (error) {
        console.error("SMS Error:", error);
    }
}

// --- SCHEDULER LOGIC ---
async function restartScheduler() {
    console.log("🔄 Updating SMS Schedule...");

    // 1. Stop old tasks
    if (morningTask) morningTask.stop();
    if (eveningTask) eveningTask.stop();

    // 2. Fetch settings
    let settings = await Settings.findOne();
    
    if (!settings) {
        settings = await Settings.create({ morningTime: "05:00", eveningTime: "14:00" });
    }

    const { morningTime, eveningTime } = settings;

    // 3. Convert Time
    const [mHour, mMin] = morningTime.split(':');
    const [eHour, eMin] = eveningTime.split(':');

    // 4. Start New Schedule
    morningTask = cron.schedule(`${mMin} ${mHour} * * *`, () => {
        sendShiftReport('Morning');
    }, { timezone: "Asia/Kolkata" });

    eveningTask = cron.schedule(`${eMin} ${eHour} * * *`, () => {
        sendShiftReport('Evening');
    }, { timezone: "Asia/Kolkata" });
}

module.exports = { restartScheduler, sendShiftReport };