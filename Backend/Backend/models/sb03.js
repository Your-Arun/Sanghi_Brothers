const mongoose = require("mongoose");

const sb03MonthlySchema = new mongoose.Schema({
  Department:{ type: mongoose.Schema.Types.Mixed },
  UserName:{
    type:String,
    required:true,
  },
 Date:{
  type:Date,
  require:true,
 },
  month: {
    type: Number,
    required: true,
    min: 1, // Month must be at least 1 (January)
    max: 12, // Month must be at most 12 (December)
  },
  year: {
    type: Number,
    required: true,
    min: 2000, // Example: Year must be at least 2000
    max: 2100, // Example: Year must be at most 2100
  },
  j: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  k: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  l: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  m: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  totalStockTank2: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  totalStockTank1: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  p: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  q: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  closingStockTank2: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  closingStockTank1: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  TotalStockk: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  Salee: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  w: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  x: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  SaleShift2: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  TotalTank12: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  aa: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);

      return Array(daysInMonth).fill(0);
    },
  },
  Tank1variance: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  ac: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  Tank2variance: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  BothTankVariance: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  af: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  ag: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  ah: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  ai: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  aj: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  ak: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  al: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  am: {
    type: [Number],
    required: true,
    default: function () {
      const daysInMonth = getDaysInMonth(this.year, this.month);
      return Array(daysInMonth).fill(0);
    },
  },
  sumofL: {
    type: Number,
    required: true,
  },
  sumofM: {
    type: Number,
    required: true,
  },
  sumofP: {
    type: Number,
    required: true,
  },
  sumofQ: {
    type: Number,
    required: true,
  },
  totalsaleee: {
    type: Number,
    required: true,
  },
  sumofW: {
    type: Number,
    required: true,
  },
  sumofX: {
    type: Number,
    required: true,
  },
  sumofY: {
    type: Number,
    required: true,
  },
  pureofL: {
    type: Number,
    required: true,
  },
  pureofM: {
    type: Number,
    required: true,
  },
  pureofP: {
    type: Number,
    required: true,
  },
  pureofQ: {
    type: Number,
    required: true,
  },
  lossOfW: {
    type: Number,
    required: true,
  },
  lossOfX: {
    type: Number,
    required: true,
  },
  lossOfY: {
    type: Number,
    required: true,
  },
  SumofAF: {
    type: Number,
    required: true,
  },
  SumofAG: {
    type: Number,
    required: true,
  },
  SumofAH: {
    type: Number,
    required: true,
  },
  SumofAI: {
    type: Number,
    required: true,
  },
  SumofAJ: {
    type: Number,
    required: true,
  },
  SumofAM: {
    type: Number,
    required: true,
  },
  target1: {
    type: Number,
    required: true,
  },
  target2: {
    type: Number,
    required: true,
  },
  target3: {
    type: Number,
    required: true,
  },
  target4: {
    type: Number,
    required: true,
  },
  totalXY: {
    type: Number,
    required: true,
  },
  sumofXY: {
    type: Number,
    required: true,
  },
  sumofvab51: {
    type: Number,
    required: true,
  },
  maybeL: {
    type: Number,
    required: true,
  },
  maybeP: {
    type: Number,
    required: true,
  },
  SumofAM: {
    type: Number,
    required: true,
  },
  SumofAJ: {
    type: Number,
    required: true,
  },
  SumofAI: {
    type: Number,
    required: true,
  },
  SumofAH: {
    type: Number,
    required: true,
  },
  SumofAG: {
    type: Number,
    required: true,
  },
  SumofAF: {
    type: Number,
    required: true,
  },
  lossOfY: {
    type: Number,
    required: true,
  },
  lossOfX: {
    type: Number,
    required: true,
  },
  lossOfW: {
    type: Number,
    required: true,
  },
  pureofQ: {
    type: Number,
    required: true,
  },
  pureofP: {
    type: Number,
    required: true,
  },
  pureofM: {
    type: Number,
    required: true,
  },
  pureofL: {
    type: Number,
    required: true,
  },
  sumofY: {
    type: Number,
    required: true,
  },
  totalsaleee: {
    type: Number,
    required: true,
  },
  totalXY: {
    type: Number,
    required: true,
  },
  sumofvab51: {
    type: Number,
    required: true,
  },
}, { timestamps: true });



const SB03Monthly = mongoose.model("SB03Monthly", sb03MonthlySchema);

module.exports = SB03Monthly;

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 1).getDate();
};
