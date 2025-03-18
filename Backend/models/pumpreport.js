const mongoose = require('mongoose');

const pumpReportSchema = new mongoose.Schema({
    dat1: {
        type: String,
        required: true,
    },
    dat2: {
        type: String,
        required: true,
    },
    dat3: {
        type: String,
        required: true,
    },
    dat4: {
        type: String,
        required: true,
    },
    dat5: {
        type: String,
        required: true,
    },
    dat6: {
        type: String,
        required: true,
    },

    a1: {
        type: Number,
        default: 0,
    },
    a2: {
        type: Number,
        default: 0,
    },
    a3: {
        type: Number,
        default: 0,
    },
    a4: {
        type: Number,
        default: 0,
    },
    b1: {
        type: Number,
        default: 0,
    },
    b2: {
        type: Number,
        default: 0,
    },
    b3: {
        type: Number,
        default: 0,
    },
    b4: {
        type: Number,
        default: 0,
    },
    c1: {
        type: Number,
        default: 0,
    },
    c2: {
        type: Number,
        default: 0,
    },
    c3: {
        type: Number,
        default: 0,
    },
    c4: {
        type: Number,
        default: 0,
    },
    d1: {
        type: Number,
        default: 0,
    },
    d2: {
        type: Number,
        default: 0,
    },
    d3: {
        type: Number,
        default: 0,
    },
    d4: {
        type: Number,
        default: 0,
    },
    e1: {
        type: Number,
        default: 0,
    },
    e2: {
        type: Number,
        default: 0,
    },
    e3: {
        type: Number,
        default: 0,
    },
    e4: {
        type: Number,
        default: 0,
    },
    f1: {
        type: Number,
        default: 0,
    },
    f2: {
        type: Number,
        default: 0,
    },
    f3: {
        type: Number,
        default: 0,
    },
    f4: {
        type: Number,
        default: 0,
    },
    g1: {
        type: Number,
        default: 0,
    },
    g2: {
        type: Number,
        default: 0,
    },
    g3: {
        type: Number,
        default: 0,
    },
    g4: {
        type: Number,
        default: 0,
    },
    h1: {
        type: Number,
        default: 0,
    },
    h2: {
        type: Number,
        default: 0,
    },
    h3: {
        type: Number,
        default: 0,
    },
    h4: {
        type: Number,
        default: 0,
    },
    i1: {
        type: Number,
        default: 0,
    },
    i2: {
        type: Number,
        default: 0,
    },
    i3: {
        type: Number,
        default: 0,
    },
    i4: {
        type: Number,
        default: 0,
    },
    j1: {
        type: Number,
        default: 0,
    },
    j2: {
        type: Number,
        default: 0,
    },
    j3: {
        type: Number,
        default: 0,
    },
    j4: {
        type: Number,
        default: 0,
    },
});

const PumpReport = mongoose.model('PumpReport', pumpReportSchema);

module.exports = PumpReport;