import React, { useState, useContext } from "react";
import axiosInstance from '../Dashboard/axiosInstance'
import saveImage from "/save.png";
import previousImage from "/previous.png";
import { Link } from "react-router-dom";
import UserContext from "../Home Page/UserContext"
import { toast } from 'react-toastify'

const Sb01 = () => {
  const { user } = useContext(UserContext);
  const [inputs, setInputs] = useState({
    c6: '',
    c7: '',
    c8: '',
    c9: '',
    c10: '',
    c11: '',
    c12: '',
    c13: '',
    c14: '',
    c15: '',
    c16: '',
    c17: '',
    c20: '',
    d6: '',
    d7: '',
    d8: '',
    d9: '',
    d10: '',
    d11: '',
    d12: '',
    d13: '',
    d14: '',
    d15: '',
    d16: '',
    d17: '',
    e6: '',
    e7: '',
    e8: '',
    e9: '',
    e10: '',
    e11: '',
    e12: '',
    e13: '',
    e14: '',
    e15: '',
    e16: '',
    e17: '',
    j10: '',
    j11: '',
    f6: '',
    f7: '',
    f8: '',
    f9: '',
    f10: '',
    f11: '',
    f12: '',
    f13: '',
    f14: '',
    f15: '',
    f16: '',
    f17: '',
    i6: '',
    i7: '',
    i8: '',
    i9: '',
    i10: '',
    i11: '',
    i12: '',
    i13: '',
    i14: '',
    i15: '',
    i16: '',
    i17: '',
    c21: '',
    c22: '',
    c23: '',
    c24: '',
    c25: '',
    c26: '',
    c27: '',
    c28: '',
    c29: '',
    c30: '',
    c31: '',
    c32: '',
    c33: '',
    c34: '',
    c35: '',
    c37: '',
    c36: '',
    c38: '',
    c39: '',
    e24: '',
    e25: '',
    e26: '',
    e27: '',
    date1: '',
    date2: '',
    date3: '',
    date4: '',
    date5: '',
    date6: '',
    date7: '',
    date8: '',
    date9: '',
  });

  const handleInputChange = (e) => {
    const { id, value, type } = e.target;

    setInputs({
      ...inputs,
      [id]: type === "number" ? value : value,
      // number aur text dono case me blank allow karna hai
    });
  };
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    setInputs({
      ...inputs,
      [id]: value || '',
    });
  };


  // handle save
  const handleSave = async (e) => {
    e.preventDefault();

    // blank values ko 0 banake DB bhejna
    const processedInputs = {};
    Object.keys(inputs).forEach((key) => {
      processedInputs[key] = inputs[key] === '' ? 0 : inputs[key];
    });

    const saveData = {
      username: user?.username,
      Department: user?.department,
      Balance_Evening: balenv,
      Total_Fund_Stock: c34result,
      Working_Cappital: workingcap,
      CalculatedValue: {
        totalsum,
        j6result,
        j7result,
        j8result,
        j9result,
        j12result,
        e16result,
        balenv,
        c34result,
        workingcap,
        e39result,
      },
      inputs: processedInputs, // ✅ Cleaned data bhejna
    };

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.warn("No valid session found. Please log in.");
        return;
      }
      await axiosInstance.post("/fundposition", saveData);
      toast.success("Data saved successfully");
    } catch (error) {
      toast.warn("Not Save Successfully...... ");
    }
  };
  const totalsum =
    inputs.c6 +
    inputs.c7 +
    inputs.c8 +
    inputs.c9 +
    inputs.c10 +
    inputs.c11 +
    inputs.c12 +
    inputs.c13 +
    inputs.c14 +
    inputs.c15 +
    inputs.c16 +
    inputs.c17;

  const j6result =
    +inputs.c6 -
    inputs.d6 -
    inputs.c27 -
    inputs.c26 -
    inputs.c25 -
    inputs.c24 +
    inputs.c13 +
    inputs.c14 +
    inputs.e16;
  const j7result =
    +inputs.c7 +
    inputs.d6 +
    inputs.e17 -
    inputs.c21 -
    inputs.c22 -
    inputs.c23 +
    inputs.c11;
  const j8result = +inputs.c8 - inputs.d8;
  const j9result = +inputs.c9 - inputs.d9;
  const j12result =
    j6result + j7result + j8result + j9result + inputs.j10 + inputs.j11;
  const e16result = +inputs.c16;
  const balenv =
    +totalsum -
    inputs.c21 -
    inputs.c22 -
    inputs.c23 -
    inputs.c25 -
    inputs.c27 -
    inputs.c26 -
    inputs.c24;
  const c34result =
    inputs.c32 + inputs.c33 + balenv - inputs.c17 - inputs.c11 + inputs.c30;
  const workingcap =
    +c34result - inputs.c35 - inputs.c36 - inputs.c37 - inputs.c38 - inputs.c39;
  const e39result =
    +inputs.c35 + inputs.c36 + inputs.c37 + inputs.c38 + inputs.c39;

  return (
    <>
      <div className="items-center justify-center p-6">
        <form onSubmit={handleSave}>
          <div>
            <div className="text-center text-4xl p-4">
              <h1>
                Fund Position of <span className="text-red-600">Sanghi Brothers</span>{" "}
              </h1>
              <h1>Bank position as on
                <input
                  type="date"
                  id="date9"
                  value={inputs.date9}
                  onChange={handleDateChange}
                  className="bg-transparent text-black px-2 py-1 "
                /> </h1>
            </div>
            <div>
              <div className="flex justify-evenly w-full p-4">
                <Link to={"/sbbank"}>
                  <div>
                    <img src={previousImage} width={50} alt="Back" className="bg-transparent" />
                  </div>
                </Link>

                <div>
                  <button type="submit" className="bg-transparent">
                    <img src={saveImage} width={50} alt="Save" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <table className="table-container">
              <thead>
                <tr>
                  <th className="border p-2"><br /></th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2" colSpan="2">Transfer</th>
                  <th className="border p-2" colSpan="2">To A/c No.</th>
                  <th className="border p-2">Accounts</th>
                  <th className="border p-2">Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">SBI xxxx06421</td>
                  <td className="p-2 border">
                    <input
                      id="c6"
                      type="number"
                      value={inputs.c6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      id="d6"
                      type="number"
                      value={inputs.d6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="e6"
                      value={inputs.e6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="f6"
                      value={inputs.f6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="i6"
                      value={inputs.i6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">{j6result}</td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">SBIN000068037</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c7"
                      value={inputs.c7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="d7"
                      value={inputs.d7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e7"
                      value={inputs.e7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="f7"
                      value={inputs.f7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="i7"
                      value={inputs.i7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">{j7result}</td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">SbI xxxxx5358</td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="c8"
                      value={inputs.c8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="d8"
                      value={inputs.d8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="e8"
                      value={inputs.e8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="f8"
                      value={inputs.f8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="i8"
                      value={inputs.i8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">{j8result}</td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c9"
                      value={inputs.c9}
                      onChange={handleInputChange}
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="number"
                      id="d9"
                      value={inputs.d9}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">{j9result.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Card payment not cr.by paytm/icici</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c10"
                      value={inputs.c10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="d10"
                      value={inputs.d10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e10"
                      value={inputs.e10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="f10"
                      value={inputs.f10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="i10"
                      value={inputs.i10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="j10"
                      value={inputs.j10}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">cash deposit in a/c from evening shift</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c11"
                      value={inputs.c11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="d11"
                      value={inputs.d11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e11"
                      value={inputs.e11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="f11"
                      value={inputs.f11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="i11"
                      value={inputs.i11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="j11"
                      value={inputs.j11}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">cash in hand of Yesterday for deposit  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c12"
                      value={inputs.c12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="d12"
                      value={inputs.d12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e12"
                      value={inputs.e12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="f12"
                      value={inputs.f12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="i12"
                      value={inputs.i12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">{j12result.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Recd.from s.v</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c13"
                      value={inputs.c13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="d13"
                      value={inputs.d13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e13"
                      value={inputs.e13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="f13"
                      value={inputs.f13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="i13"
                      value={inputs.i13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="j13"
                      value={inputs.j13}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Recd.from Mukund Sanghi </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c14"
                      value={inputs.c14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="d14"
                      value={inputs.d14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e14"
                      value={inputs.e14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="f14"
                      value={inputs.f14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="i14"
                      value={inputs.i14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="j14"
                      value={inputs.j14}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">other deposits</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c15"
                      value={inputs.c15}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Deposit</td>
                  <td className="p-2 border">to a/c no.</td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">cash of yesterday for deposit in other a/c </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c16"
                      value={inputs.c16}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">{e16result.toFixed(2)}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="f16"
                      value={inputs.f16}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Today 1 shift Amt.deposit in a/c</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c17"
                      value={inputs.c17}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e17"
                      value={inputs.e17}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="f17"
                      value={inputs.f17}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Total</td>
                  <td className="p-2 border">{totalsum.toFixed(2)}</td>
                </tr>

                <tr>
                  <br />
                </tr>
                <tr>
                  <br />
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border"> payment to bpcl for invoice <input type="date" id="date1" value={inputs.date1} onChange={handleDateChange} /> </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c21"
                      value={inputs.c21}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border"> payment to bpcl for invoice <input type="date" id="date2" value={inputs.date2} onChange={handleDateChange} /> </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c22"
                      value={inputs.c22}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border"> payment to bpcl for invoice <input type="date" id="date3" value={inputs.date3} onChange={handleDateChange} /> </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c23"
                      value={inputs.c23}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Pd to Hearing healthcare</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c24"
                      value={inputs.c24}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e24"
                      value={inputs.e24}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Pd to A.K.SANGHI</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c25"
                      value={inputs.c25}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e25"
                      value={inputs.e25}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Pd to GST OF PP</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c26"
                      value={inputs.c26}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e26"
                      value={inputs.e26}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Pd FOR AIR COMPRESSOR</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c27"
                      value={inputs.c27}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="e27"
                      value={inputs.e27}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Balance in evening</td>
                  <td className="p-2 border">{balenv.toFixed(2)}</td>
                </tr>

                <tr>
                  <br />
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="c30"
                      value={inputs.c30}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <br />
                </tr>
                <tr>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="a32"
                      value={inputs.a32}
                      onChange={handleInputChange}
                    />
                  </td>

                  <td className="p-2 border">Today morning stock value of petrol</td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="c32"
                      value={inputs.c32}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      id="d32"
                      value={inputs.d32}
                      onChange={handleInputChange}
                    />{" "}
                    per Ltr rate
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="a33"
                      value={inputs.a33}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">Petrol PUR for the Day</td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="c33"
                      value={inputs.c33}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Total Fund including stock</td>
                  <td className="p-2 border"> {c34result.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Due payment to bpcl for invoice <input type="date" id="date4" value={inputs.date4} onChange={handleDateChange} /> </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="c35"
                      value={inputs.c35}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Due payment to bpcl for invoice <input type="date" id="date5" value={inputs.date5} onChange={handleDateChange} /> </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="c36"
                      value={inputs.c36}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Due payment to bpcl for invoice <input type="date" id="date6" value={inputs.date6} onChange={handleDateChange} /> </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="c37"
                      value={inputs.c37}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Due payment to bpcl for invoice <input type="date" id="date7" value={inputs.date7} onChange={handleDateChange} /> </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="c38"
                      value={inputs.c38}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">Due payment to bpcl for OIL invoice </td>
                  <td className="p-2 border">
                    {" "}
                    <input
                      type="number"
                      id="c39"
                      value={inputs.c39}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2 border">
                    <input type="date" id="date8" value={inputs.date8} onChange={handleDateChange} />
                  </td>
                  <td className="p-2 border">
                    {e39result.toFixed(2)} <br />
                    TOTAL DUE as on AS PER BPCL <br />
                    LEDGER CR.RECd
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                  <td className="p-2 border">working capital</td>
                  <td className="p-2 border">{workingcap.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <br />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </form >
      </div >
    </>
  );
};

export default Sb01;
