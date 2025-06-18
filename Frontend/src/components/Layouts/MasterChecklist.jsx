import React, { useState } from "react";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { Link } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import { toast } from 'react-toastify'

const MasterChecklist = () => {

  const [inputValues, setInputValues] = useState({
    dat1: 0,
    dat2: 0,
    dat3: 0,
    dat4: 0,
    dat5: 0,
    dat6: 0,
    a1: '',
    a2: '',
    a3: '',
    a4: '',
    b1: '',
    b2: '',
    b3: '',
    b4: '',
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    d1: '',
    d2: '',
    d3: '',
    d4: '',
    e1: '',
    e2: '',
    e3: '',
    e4: '',
    f1: '',
    f2: '',
    f3: '',
    f4: '',
    g1: '',
    g2: '',
    g3: '',
    g4: '',
    h1: '',
    h2: '',
    h3: '',
    h4: '',
    i1: '',
    i2: '',
    i3: '',
    i4: '',
    j1: '',
    j2: '',
    j3: '',
    j4: '',
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
      const response = await axiosInstance.post(
        "/mastersheet/pumpsheet",
        datasheet
      );
      toast.success("Save successful");
    } catch (error) {
      toast.warn("Error saving data");
    }
  };
  return (
  <div className="flex flex-col items-center  bg-gradient-to-r from-blue-400 to-yellow-400 justify-center p-6">
      <h1 className="text-center  text-xl p-4">PUMP REPORT SHEET</h1>
      <form onSubmit={handlesave}>
        <div className="text-center text-xl p-4">
          <h1 >
            Exceptional Report of{" "}
            <input
              type="date"
              id="dat1"
              className="bg-transparent"
              value={inputValues.dat1}
              onChange={handleInputChange}
            /> </h1>
          <h2>
            Reported on <input
              className="bg-transparent"
              type="date"
              id="dat2"
              value={inputValues.dat2}
              onChange={handleInputChange}
            />
          </h2>
        </div>
        <div className="flex justify-evenly items-center  p-4">
          <Link to={"/mastersheet"}>
            <div className="">
              <img src={previousImage} width={50} alt="Back" />
            </div>
          </Link>
          <div>
            <button type="submit" className="bg-transparent">
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
                <input
                  type="date"
                  id="dat3"
                  value={inputValues.dat3}
                  onChange={handleInputChange}
                />  </td>
            </tr>
            <tr>
              <td>
                Stock on    <input
                  type="date"
                  id="dat4"
                  value={inputValues.dat4}
                  onChange={handleInputChange}
                />
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
                Indent for <input
                  type="date"
                  id="dat5"
                  value={inputValues.dat5}
                  onChange={handleInputChange}
                />
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
                Indent for <input
                  type="date"
                  id="dat6"
                  value={inputValues.dat6}
                  onChange={handleInputChange}
                />
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