import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import previousImage from "/public/previous.png";
import saveImage from "/public/save.png";
import binImage from "/public/bin.png";


function ReportFile() {
  const date = new Date();
  const getNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay.toLocaleTimeString;
  };
  const navigate = useNavigate();
  const [entryDate, setEntryDate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [inputs, setInputs] = useState({
    b3: 0,
    c4: 0,
    d4: 0,
    e4: 0,
    f4: 0,
    g4: 0,
    h4: 0,
    c5: 0,
    d5: 0,
    e5: 0,
    f5: 0,
    g5: 0,
    h5: 0,
    b12: 0,
    b14: 0,
    b16: 0,
    b17: 0,
    b18: 0,
    b19: 0,
    b20: 0,
    b21: 0,
    b22: 0,
    b23: 0,
    b24: 0,
    b25: 0,
    b26: 0,
    b27: 0,
    b28: 0,
    b29: 0,
    b30: 0,
    b31: 0,
    b32: 0,
    b33: 0,
    b34: 0,
    b35: 0,
    b36: 0,
    b37: 0,
    b38: 0,
    b39: 0,
    b40: 0,
    b41: 0,
    b42: 0,
    b43: 0,
    c8: 0,
    d8: 0,
    e8: 0,
    f8: 0,
    f12: 0,
    g12: 0,
    h12: 0,
    f13: 0,
    g13: 0,
    h13: 0,
    f14: 0,
    g14: 0,
    h14: 0,
  });
  const [reports, setReports] = useState({
    b4result: 0,
    b5result: 0,
    b6result: 0,
    c6result: 0,
    d6result: 0,
    e6result: 0,
    f6result: 0,
    g6result: 0,
    h6result: 0,
    stockrecord: 0,
    perdip: 0,
    variance: 0,
    perVar: 0,
    avgmonth: 0,
    avgdiff: 0,
    cashsales: 0,
    ftera: 0,
    gtera: 0,
    htera: 0,
    feighteen: 0,
    geighteen: 0,
    heighteen: 0,
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5500/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };
    fetchDepartments();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs({
      ...inputs,
      [id]: value === "" ? 0 : parseFloat(value) || 0, // Set to 0 if empty, otherwise parse
    });
  };

  const b4result =
    inputs.c4 + inputs.d4 + inputs.e4 + inputs.f4 + inputs.g4 + inputs.h4;
  const b5result =
    inputs.c5 + inputs.d5 + inputs.e5 + inputs.f5 + inputs.g5 + inputs.h5;
  const b6result = b4result + b5result;
  const c6result = inputs.c4 + inputs.c5;
  const d6result = inputs.d4 + inputs.d5;
  const e6result = inputs.e4 + inputs.e5;
  const f6result = inputs.f4 + inputs.f5;
  const g6result = inputs.g4 + inputs.g5;
  const h6result = inputs.h4 + inputs.h5;
  const stockrecord = inputs.b3 + inputs.b14 - inputs.b12;
  const perdip = inputs.c8 + inputs.d8 + inputs.e8 + inputs.f8;
  const variance = perdip - stockrecord;
  const perVar =
    inputs.b12 !== 0 ? ((variance / inputs.b12) * 100).toFixed(2) : 0;
  const avgmonth = inputs.b12 !== 0 ? (inputs.b12 / 11).toFixed(2) : 0;
  const avgdiff = avgmonth - inputs.b16;
  const cashsales = b6result - inputs.b43;
  const ftera =
    inputs.f13 !== 0 ? ((inputs.f12 / inputs.f13) * 100).toFixed(2) : 0;
  const gtera =
    inputs.g13 !== 0 ? ((inputs.g12 / inputs.g13) * 100).toFixed(2) : 0;
  const htera =
    inputs.h13 !== 0 ? ((inputs.h12 / inputs.h13) * 100).toFixed(2) : 0;
  const feighteen = inputs.f14 !== 0 ? (inputs.f13 / 31).toFixed(2) : 0;
  const geighteen = inputs.g14 !== 0 ? (inputs.g13 / 31).toFixed(2) : 0;
  const heighteen = inputs.h14 !== 0 ? (inputs.h13 / 31).toFixed(2) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required data is available
    if (
      !entryDate ||
      !selectedDepartment ||
      Object.keys(inputs).length === 0 ||
      Object.keys(reports).length === 0
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const reportData = {
      entryDate,
      department: selectedDepartment,
      reports: {
        b4result,
        b5result,
        b6result,
        c6result,
        d6result,
        e6result,
        f6result,
        g6result,
        h6result,
        stockrecord,
        perdip,
        variance,
        perVar,
        avgmonth,
        avgdiff,
        cashsales,
        ftera,
        gtera,
        htera,
        feighteen,
        geighteen,
        heighteen,
      },
      inputs: {
        ...inputs, // All input values
      },
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found. Please log in.");
        return;
      }
      const resp = await axios.post(
        "http://localhost:5500/reportfile",
        reportData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Data saved successfully");
      console.log(resp.data);
    } catch (error) {
      console.error("Error saving report:", error);
      alert("kaam nhhh kr rha h");
    }
  };
  return (
    <>
      {" "}
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <h1 className="text-3xl mt-5  font-thin text-center  text-red-950  mb-4">
              Report File
            </h1>
            <div className="flex justify-evenly items-center  p-4">
              <Link to={"/dashboard"}>
                <div className=" rounded-md p-2">
                  <img src={previousImage} width={50} alt="Back" />
                </div>
              </Link>
              <div className="flex flex-col justify-center items-center">
                <label className="block mb-2 text-gray-700">Select Department:</label>
                <select
                  className="w-full p-2 border rounded mb-4"
                  value={selectedDepartment}
                  required
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="" disabled>
                    -- Choose a Department --
                  </option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-center items-center">
                <label className="block mb-2 text-gray-700">Select Date:</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="border rounded p-2 w-full"
                  required
                />
              </div>
              <div>
                <button type="submit" className=" rounded-md p-2">
                  <img src={saveImage} width={50} alt="Save" />
                </button>
              </div>
            </div>

            <table className="font-serif text-center">
              <tbody>
                <tr className=" text-xl">
                  <th>Name</th>
                  <th>Sales</th>
                  <th>Road</th>
                  <th>Road</th>
                  <th>Showroom</th>
                  <th>Showroom</th>
                  <th>Ns </th>
                  <th>Ns </th>
                </tr>
                <tr>
                  <td>Nozzele No.</td>
                  <td></td>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>Opening Stock 01/12/24</td>
                  <td>
                    <div className="opeingstock">
                      <input
                        type="number"
                        id="b3"
                        value={inputs.b3}
                        onChange={handleInputChange}
                      />
                      Litre
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Shift -1</td>
                  <td className="bfour" id="b4">
                    <div id="b4results">{b4result}</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="c4"
                      id="c4"
                      value={inputs.c4}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="d684"
                      id="d4"
                      value={inputs.d4}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="e4"
                      id="e4"
                      value={inputs.e4}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="f4"
                      id="f4"
                      value={inputs.f4}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="g4"
                      id="g4"
                      value={inputs.g4}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="h4"
                      id="h4"
                      value={inputs.h4}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Shift -2</td>
                  <td className="bfive" id="b5">
                    <div id="b5results">{b5result}</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="c5"
                      id="c5"
                      value={inputs.c5}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="d5"
                      id="d5"
                      value={inputs.d5}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="e5"
                      id="e5"
                      value={inputs.e5}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="f5"
                      id="f5"
                      value={inputs.f5}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="g5"
                      id="g5"
                      value={inputs.g5}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="h5"
                      id="h5"
                      value={inputs.h5}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Total Sales</td>
                  <td className="bsix" id="b6" onChange={handleInputChange}>
                    {b6result}
                  </td>
                  <td>{c6result}</td>
                  <td>{d6result}</td>
                  <td>{e6result}</td>
                  <td>{f6result}</td>
                  <td>{g6result}</td>
                  <td>{h6result}</td>
                </tr>
                <tr>
                  <td>Stock as per Record</td>
                  <td
                    className="bseven"
                    id="b7"
                    value={inputs.b7}
                    onChange={handleInputChange}
                  >
                    <div>{stockrecord}</div>
                  </td>
                  <td>Tank 1</td>
                  <td>Tank 2</td>
                  <td>In lorry</td>
                  <td>water/ms</td>
                </tr>
                <tr>
                  <td>Stock as per dip</td>
                  <td
                    className="beight"
                    id="b8"
                    value={inputs.b8}
                    onChange={handleInputChange}
                  >
                    <div>{perdip}</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="c8"
                      id="c8"
                      value={inputs.c8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="d8"
                      id="d8"
                      value={inputs.d8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="e8"
                      id="e8"
                      value={inputs.e8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="f8"
                      id="f8"
                      value={inputs.f8}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Vairance +/-</td>
                  <td className="bnine">{variance}</td>
                  <td
                    className="c9"
                    id="c9"
                    value={inputs.c9}
                    onChange={handleInputChange}
                  >
                    {perVar}
                  </td>
                </tr>
                <tr>
                  <td>Avg. for the month</td>
                  <td
                    className="bten"
                    id="b10"
                    value={inputs.b10}
                    onChange={handleInputChange}
                  >
                    <div>{avgmonth}</div>
                  </td>
                </tr>
                <tr>
                  <td>Sale target</td>
                  <td className="beleven">
                    <input
                      type="number"
                      id="b11"
                      value={inputs.b11}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Actual sale till date</td>
                  <td className="btwelve">
                    <input
                      type="number"
                      id="b12"
                      value={inputs.b12}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Pur. target last yr</td>
                  <td className="bthirteen">
                    <input
                      id="b13"
                      type="number"
                      value={inputs.b13}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Pur till date</td>
                  <td className="bforteen">
                    <input
                      type="number"
                      id="b14"
                      value={inputs.b14}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Our Target</td>
                  <td className="bfifteen">
                    <input
                      type="number"
                      id="b15"
                      value={inputs.b15}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>If avg is</td>
                  <td className="bsixteen">
                    <input
                      type="number"
                      id="b16"
                      value={inputs.b16}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Avg Diff.</td>
                  <td id="b17">{avgdiff}</td>
                </tr>
                <tr>
                  <td>Pdp for Today</td>
                  <td>
                    <input
                      id="b18"
                      type="number"
                      value={inputs.b18}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    Pdp for Next day <span>{getNextDay()}</span>
                  </td>
                  <td>
                    <input
                      id="b19"
                      type="number"
                      step="0.01"
                      value={inputs.b19}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>New Rate Today</td>
                  <td>
                    <input
                      id="b20"
                      type="number"
                      step="0.01"
                      value={inputs.b20}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Old Rate</td>
                  <td>
                    <input
                      id="b21"
                      type="number"
                      step="0.01"
                      value={inputs.b21}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>2T 1ltr</td>
                  <td>
                    <input
                      id="b22"
                      type="number"
                      value={inputs.b22}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>2t 500ml</td>
                  <td>
                    <input
                      id="b23"
                      type="number"
                      value={inputs.b23}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>2T 250ml</td>
                  <td>
                    <input
                      id="b24"
                      type="number"
                      value={inputs.b24}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>60ml pouch sold</td>
                  <td>
                    <input
                      id="b25"
                      type="number"
                      value={inputs.b25}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>40ml pouch sold</td>
                  <td>
                    <input
                      id="b26"
                      type="number"
                      value={inputs.b26}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>20ml pouch sold</td>
                  <td>
                    <input
                      id="b27"
                      type="number"
                      value={inputs.b27}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Classic 1 Ltr sold</td>
                  <td>
                    <input
                      id="b28"
                      type="number"
                      value={inputs.b28}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Nxt 1 Ltr</td>
                  <td>
                    <input
                      id="b29"
                      type="number"
                      value={inputs.b29}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Nxt 900ml</td>
                  <td>
                    <input
                      id="b30"
                      type="number"
                      value={inputs.b30}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>4T Plus 1 ltr</td>
                  <td>
                    <input
                      id="b31"
                      type="number"
                      value={inputs.b31}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>4T Plus 900ml</td>
                  <td>
                    <input
                      id="b32"
                      type="number"
                      value={inputs.b32}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>4T Zipp 1 Ltr</td>
                  <td>
                    <input
                      id="b33"
                      type="number"
                      value={inputs.b33}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>4T Zipp 900ml</td>
                  <td>
                    <input
                      id="b34"
                      type="number"
                      value={inputs.b34}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Stotech</td>
                  <td>
                    <input
                      id="b35"
                      type="number"
                      value={inputs.b35}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Hero Honda 800ml</td>
                  <td>
                    <input
                      id="b36"
                      type="number"
                      value={inputs.b36}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Hero Honda 900ml</td>
                  <td>
                    <input
                      id="b37"
                      type="number"
                      value={inputs.b37}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Ready cool 1 Ltr</td>
                  <td>
                    <input
                      id="b38"
                      type="number"
                      value={inputs.b38}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Ready cool 500ml</td>
                  <td>
                    <input
                      id="b39"
                      type="number"
                      value={inputs.b39}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>60ml pouch leakage</td>
                  <td>
                    <input
                      id="b40"
                      type="number"
                      value={inputs.b40}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>40ml pouch leakage</td>
                  <td>
                    <input
                      id="b41"
                      type="number"
                      value={inputs.b41}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>20ml pouch leakage</td>
                  <td>
                    <input
                      id="b42"
                      type="number"
                      value={inputs.b42}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Today Credit Sold</td>
                  <td>
                    <input
                      type="number"
                      id="b43"
                      value={inputs.b43}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Today Cash Sales</td>
                  <td id="b44" value={inputs.b44} onChange={handleInputChange}>
                    {cashsales}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="text-center mb-20">
              <h2>This Month , last year</h2>
              <table className="text-center justify-center mx-auto">
                <thead>
                  {" "}
                  <tr>
                    <th>2023</th>
                    <th>2022</th>
                    <th>2021</th>
                    <th>Last 3Year</th>
                  </tr>
                </thead>
                <tbody>
                  {" "}
                  <tr>
                    <td>
                      <input
                        type="number"
                        id="f12"
                        value={inputs.f12}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id="g12"
                        value={inputs.g12}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id="h12"
                        value={inputs.h12}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className="text-red-700">Loss</td>
                  </tr>
                  <tr>
                    <td>{ftera}</td>
                    <td>{gtera}</td>
                    <td>{htera}</td>
                    <td>% Sale</td>
                  </tr>
                  <tr>
                    <td>

                    </td>
                    <td> </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="number"
                        id="f13"
                        value={inputs.f13}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id="g13"
                        value={inputs.g13}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id="h13"
                        value={inputs.h13}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>Sale</td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="number"
                        id="f14"
                        value={inputs.f14}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id="g14"
                        value={inputs.g14}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id="h14"
                        value={inputs.h14}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>Pure</td>
                  </tr>
                  <tr>
                    <td>{feighteen}</td>
                    <td>{geighteen}</td>
                    <td>{heighteen}</td>
                    <td>Avg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
export default ReportFile;
