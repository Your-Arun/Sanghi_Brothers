import React, { useState } from "react";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { Link } from "react-router-dom";
import axios from "axios";

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

  const items = [
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
  ];

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
      const response = await axios.post("http://localhost:5500/mastersheet/salesmanagementsheet", data);
      console.log(response.data);
      alert("Sales management sheet saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving sales management sheet!");
    }
  };

  return (
    <>
      <div>
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
              <button type="submit">
                <img src={saveImage} width={50} alt="Save" />
              </button>{" "}
            </div>
          </div>
          <table>
            <thead>
              <th>Point</th>
              <th>Item to Check</th>
              <th>Ok</th>
              <th>Responsible</th>
              <th>Defect Person</th>
              <th>Defect Delays Days</th>
              <th>Deadline</th>
            </thead>
            <tbody>
              {inputs.points.map((point, index) => (
                <tr key={index}>
                  <td>
                   {index + 1}
                  </td>
                  <td>
                    {items[index]}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      id="ok"
                      checked={point.ok}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="responsible"
                      value={point.responsible}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="defectPerson"
                      value={point.defectPerson}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="defectDelaysDays"
                      value={point.defectDelaysDays}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="deadline"
                      value={point.deadline}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default salesMangemnesheet;