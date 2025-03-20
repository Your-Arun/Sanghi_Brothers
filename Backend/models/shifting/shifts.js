const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
    date: { type: Date},
    shiftType: { type: String, enum: ["Morning", "Evening"] },
    startTime: { type: String},
    endTime: { type: String },
    supervisor: { type: String }, // Supervisor name
    airBoy: { type: String, }, // Air Boy name
    nozzles: [
        {
            nozzleNumber: { type: String },
            member: { type: String },
            overtime: { type: Boolean, default: false }
        }
    ]
});

const Shift = mongoose.model("Shift", shiftSchema);

module.exports = Shift;
