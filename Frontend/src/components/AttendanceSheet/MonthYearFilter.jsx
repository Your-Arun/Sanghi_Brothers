import React from "react";

const MonthYearFilter = ({ month, setMonth, year, setYear }) => {
  return (
    <div className="flex gap-2 items-center">
      <select
        value={month}
        onChange={(e) => setMonth(parseInt(e.target.value))}
        className="border px-4 py-2 rounded"
      >
        {[...Array(12)].map((_, i) => (
          <option key={i} value={i + 1}>
            {new Date(0, i).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value))}
        className="border px-4 py-2 rounded w-[100px]"
      />
    </div>
  );
};

export default MonthYearFilter;
