import React, { useState } from "react";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { Link } from "react-router-dom";
import axios from "axios";

const MasterChecklist = () => {
  const predate = new Date();
  predate.setDate(predate.getDate() - 1);
  const daybck = new Date();
  daybck.setDate(daybck.getDate() - 2);
  const daytoback = new Date();
  daytoback.setDate(daytoback.getDate() - 3);
  const date = new Date();
  const [inputValues, setInputValues] = useState({
    date: `${daybck.getDate().toString().padStart(2, "0")}-${(
      daybck.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${daybck.getFullYear()}`,
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    b1: 0,
    b2: 0,
    b3: 0,
    b4: 0,
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0,
    d1: 0,
    d2: 0,
    d3: 0,
    d4: 0,
    e1: 0,
    e2: 0,
    e3: 0,
    e4: 0,
    f1: 0,
    f2: 0,
    f3: 0,
    f4: 0,
    g1: 0,
    g2: 0,
    g3: 0,
    g4: 0,
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    i1: 0,
    i2: 0,
    i3: 0,
    i4: 0,
    j1: 0,
    j2: 0,
    j3: 0,
    j4: 0,
  });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  const handlesave = async (e) => {
    e.preventDefault();
    try {
      const datasheet = { ...inputValues };

      console.log(datasheet); // Check the data before sending it
      const response = await axios.post(
        "http://localhost:5500/mastersheet/pumpsheet",
        datasheet
      );
      console.log(response); // Check the response from the server
      alert("Save successful");
    } catch (error) {
      alert("Error saving data");
    }
  };
  return (
    <div>
      <h1 className="text-center mt-[-30px] text-xl p-4">PUMP REPORT SHEET</h1>
      <form onSubmit={handlesave}>
      <div className="text-center mt-[-20px] text-xl p-4">
            <h1>
              Exceptional Report of{" "}
              {daytoback.getDate().toString().padStart(2, "0")}-
              {(daytoback.getMonth() + 1).toString().padStart(2, "0")}-
              {daytoback.getFullYear()}{" "}
            </h1>
            <h2>
              Reported on {daybck.getDate().toString().padStart(2, "0")}-
              {(daybck.getMonth() + 1).toString().padStart(2, "0")}-
              {daybck.getFullYear()}
            </h2>
          </div>
        <div className="flex justify-evenly items-center  p-4">
          <Link to={"/mastersheet"}>
            <div className="">
              <img src={previousImage} width={50} alt="Back" />
            </div>
          </Link>
          <div>
            <button type="submit">
              <img src={saveImage} width={50} alt="Save" />
            </button>{" "}
          </div>
        </div>
        <table>
          <thead>
            <th>Name</th>
            <th colSpan={4}>Amount</th>
          </thead>
          <tbody>
            <tr>
              <td>Average sale for the month</td>
              <td>
                <input
                  type="number"
                  id="a1"
                  value={inputValues.a1}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  id="a2"
                  value={inputValues.a2}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  id="a3"
                  value={inputValues.a3}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  id="a4"
                  value={inputValues.a4}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
            </tr>
            <tr>
              <td>Loss for the month till date</td>
              <td>
                <input
                  type="number"
                  id="b1"
                  value={inputValues.b1}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  id="b2"
                  value={inputValues.b2}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  id="b3"
                  value={inputValues.b3}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  id="b4"
                  value={inputValues.b4}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Sale for the day</td>
              <td>
                <input
                  type="number"
                  id="c1"
                  value={inputValues.c1}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  id="c2"
                  value={inputValues.c2}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  id="c3"
                  value={inputValues.c3}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  id="c4"
                  value={inputValues.c4}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Purchase up to date</td>
              <td>
                <input
                  type="number"
                  id="d1"
                  value={inputValues.d1}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  id="d2"
                  value={inputValues.d2}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  id="d3"
                  value={inputValues.d3}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  id="d4"
                  value={inputValues.d4}
                  onChange={handleInputChange}
                />
                Kl
              </td>
            </tr>
            <tr>
              <td>Sales up to date</td>
              <td>
                <input
                  type="number"
                  id="e1"
                  value={inputValues.e1}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  id="e2"
                  value={inputValues.e2}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  id="e3"
                  value={inputValues.e3}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  id="e4"
                  value={inputValues.e4}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
            </tr>
            <tr>
              <td>Working capital available</td>
              <td>
                <input
                  type="number"
                  id="f1"
                  value={inputValues.f1}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  id="f2"
                  value={inputValues.f2}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  id="f3"
                  value={inputValues.f3}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  id="f4"
                  value={inputValues.f4}
                  onChange={handleInputChange}
                />
                Lac
              </td>
            </tr>
            <tr>
              {" "}
              <td colSpan={6}>
                After all payments to bpcl (including dues and stock in hand
                morning) till today pur.{" "}
                {predate.getDate().toString().padStart(2, "0")}-
                {(predate.getMonth() + 1).toString().padStart(2, "0")}-
                {predate.getFullYear()}
              </td>
            </tr>
            <tr>
              <td>
                Stock on {daybck.getDate().toString().padStart(2, "0")}-
                {(daybck.getMonth() + 1).toString().padStart(2, "0")}-
                {daybck.getFullYear()}
              </td>
              <td>
                <input
                  type="number"
                  id="g1"
                  value={inputValues.g1}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  id="g2"
                  value={inputValues.g2}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  id="g3"
                  value={inputValues.g3}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  id="g4"
                  value={inputValues.g4}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
            </tr>
            <tr>
              <td>
                Indent for {predate.getDate().toString().padStart(2, "0")}-
                {(predate.getMonth() + 1).toString().padStart(2, "0")}-
                {predate.getFullYear()}
              </td>
              <td>
                <input
                  type="number"
                  id="h1"
                  value={inputValues.h1}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  id="h2"
                  value={inputValues.h2}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  id="h3"
                  value={inputValues.h3}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  id="h4"
                  value={inputValues.h4}
                  onChange={handleInputChange}
                />
                Kl
              </td>
            </tr>
            <tr>
              <td>
                Indent for {date.getDate().toString().padStart(2, "0")}-
                {(date.getMonth() + 1).toString().padStart(2, "0")}-
                {date.getFullYear()}
              </td>
              <td>
                <input
                  type="number"
                  id="i1"
                  value={inputValues.i1}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  id="i2"
                  value={inputValues.i2}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  id="i3"
                  value={inputValues.i3}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  id="i4"
                  value={inputValues.i4}
                  onChange={handleInputChange}
                />
                Kl
              </td>
            </tr>
            <tr>
              <td>Due payment to BPCL today</td>
              <td>
                <input
                  type="number"
                  id="j1"
                  value={inputValues.j1}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  id="j2"
                  value={inputValues.j2}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  id="j3"
                  value={inputValues.j3}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  id="j4"
                  value={inputValues.j4}
                  onChange={handleInputChange}
                />
                Lac
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default MasterChecklist;
