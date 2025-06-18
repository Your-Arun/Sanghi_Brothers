import React, { useState } from "react";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { Link } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import { toast } from 'react-toastify'

const salesMangemnesheet = () => {
  const [date, setDate] = useState('');


  const [inputs, setInputs] = useState({
    points: Array(37).fill("").map((_, index) => ({
      point: "",
      itemToCheck: "",
      ok: "",
      responsible: "",
      defectPerson: "",
      defectDelaysDays: "",
      deadline: "",
    })),
  });

  const [items, setItems] = useState([
    "Yesterday's Sale Report Checked",
    "Petrol  loss Reconciliation  +/-,tankwise",
    "Sales Invoices Feed in computer",
    "Paytm Amount check shiftwise",
    "Credit Card check shiftwise",
    "All Sales check nozzle wise with amount",
    "MPD Rate Change done before 6AM (Automation)",
    "Non Space Rate Change done before 6AM (Automation)",
    "Opening time before 6AM?",
    "Customer Complain received yesterday?",
    "5 ltr  testing done  from all nozzles",
    "All standys taken out 2 nos",
    "Air facilities available",
    "Check shiftwise sale for DSM/DSW",
    "Bpcl register done",
    "All 6 nozzle work propely",
    "Any complain book to bpcl ",
    "Proper debit note fill up",
    "Morning density put in register both tank",
    "Today decant density put in register both tank",
    "Proper direction given to customer",
    "Oil change Machine taken out",
    "Camper for drinking water 2 nos taken out",
    "Stock board update taken out morning",
    "Both tank check with water paste",
    "Air machine working",
    "Paytm code for all staff",
    "Pending slip check",
    "Any Nozzle +/- Delilverd report",
    "Cleaning of 4 wheeler glass taken out",
    "Automation mismatch report",
    "Peo cleaning",
    "Fire extinguisher checked daily",
    "Complain book in bpcl resolved",
    "Any maintance work",
    "", ""]);

  const handleInputChnge = (e, index) => {
    const { id, value, checked } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      points: prevInputs.points.map((point, pointIndex) =>
        pointIndex === index ? { ...point, [id]: id === 'ok' ? checked : value } : point
      ),
    }));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      dat2: new Date(date).toISOString().split('T')[0],
      points: inputs.points.map((point) => ({
        ...point,
        ok: point.ok,
      })),
    };
    try {
      const response = await axiosInstance.post("/mastersheet/salesmanagementsheet", data);
      toast.success("Sales management sheet saved successfully!");
    } catch (error) {
      toast.warn("Error saving sales management sheet!");
    }
  };

  const handleItemChange = (e, index) => {
    const updatedItems = [...items];
    updatedItems[index] = e.target.value;
    setItems(updatedItems);
  };

  return (
    <>
      <div className="flex flex-col items-center bg-gradient-to-r from-blue-400 to-yellow-400 justify-center bg-gray-100 p-6">
        <h1 className="text-center mt-[-30px] text-2xl p-4 font-bold">SALES MANAGEMENT SHEET</h1>
        <form onSubmit={handleSave}>
          <div className="flex justify-evenly items-center  p-4">
            <Link to={"/mastersheet"}>
              <div className="">
                <img src={previousImage} width={50} alt="Back" />
              </div>
            </Link>
            <div><input type="date" id="date" value={date} className="bg-transparent" onChange={handleDateChange} />
            </div>
            <div>
              <button type="submit" className="bg-transparent">
                <img src={saveImage} width={50} alt="Save" />
              </button>{" "}
            </div>
          </div>
          <div className="overflow-x-auto w-full max-w-screen-lg mx-auto">
            <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Point</th>
                  <th className="p-2 border">Item to Check</th>
                  <th className="p-2 border">Ok</th>
                  <th className="p-2 border">Responsible</th>
                  <th className="p-2 border">Defect Person</th>
                  <th className="p-2 border">Defect Delays Days</th>
                  <th className="p-2 border">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">
                      <input type="text" value={item} onChange={(e) => handleItemChange(e, index)} className="w-full border p-1" />
                    </td>
                    <td className="p-2 border text-center">
                      <input type="checkbox" id="ok" checked={inputs.points[index]?.ok} onChange={(e) => handleInputChnge(e, index)} />
                    </td>
                    <td className="p-2 border">
                      <input type="text" id="responsible" value={inputs.points[index]?.responsible} onChange={(e) => handleInputChnge(e, index)} className="w-full border p-1" />
                    </td>
                    <td className="p-2 border">
                      <input type="text" id="defectPerson" value={inputs.points[index]?.defectPerson} onChange={(e) => handleInputChnge(e, index)} className="w-full border p-1" />
                    </td>
                    <td className="p-2 border">
                      <input type="text" id="defectDelaysDays" value={inputs.points[index]?.defectDelaysDays} onChange={(e) => handleInputChnge(e, index)} className="w-full border p-1" />
                    </td>
                    <td className="p-2 border">
                      <input type="text" id="deadline" value={inputs.points[index]?.deadline} onChange={(e) => handleInputChnge(e, index)} className="w-full border p-1" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </form>
      </div>
    </>
  );
};

export default salesMangemnesheet;