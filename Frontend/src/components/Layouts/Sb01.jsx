import React, { useState, useContext, useEffect } from "react";
import axiosInstance from '../Dashboard/axiosInstance'
import saveImage from "/save.png";
import previousImage from "/previous.png";
import { Link } from "react-router-dom";
import UserContext from "../Home Page/UserContext"
import { toast } from 'react-toastify'

const Sb01 = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { user } = useContext(UserContext);

  const [inputs, setInputs] = useState({
    c6: 0,
    c7: 0,
    c8: 0,
    c9: 0,
    c10: 0,
    c11: 0,
    c12: 0,
    c13: 0,
    c14: 0,
    c15: 0,
    c16: 0,
    c17: 0,
    c20:0,
    d6: 0,
    d7: 0,
    d8: 0,
    d9: 0,
    d10: 0,
    d11: 0,
    d12: 0,
    d13: 0,
    d14: 0,
    d15: 0,
    d16: 0,
    d17: 0,
    e6: 0,
    e7: 0,
    e8: 0,
    e9: 0,
    e10: 0,
    e11: 0,
    e12: 0,
    e13: 0,
    e14: 0,
    e15: 0,
    e16: 0,
    e17: 0,
    j: 10,
    j11: 0,
    f6: 0,
    f7: 0,
    f8: 0,
    f9: 0,
    f10: 0,
    f11: 0,
    f12: 0,
    f13: 0,
    f14: 0,
    f15: 0,
    f16: 0,
    f17: 0,
    i6: 0,
    i7: 0,
    i8: 0,
    i9: 0,
    i10: 0,
    i11: 0,
    i12: 0,
    i13: 0,
    i14: 0,
    i15: 0,
    i16: 0,
    i17: 0,
    c21: 0,
    c22: 0,
    c23: 0,
    c24: 0,
    c25: 0,
    c26: 0,
    c27: 0,
    c28: 0,
    c29: 0,
    c30: 0,
    c31: 0,
    c32: 0,
    c33: 0,
    c34: 0,
    c35: 0,
    c37: 0,
    c36: 0,
    c38: 0,
    c39: 0,
    e24: 0,
    e25: 0,
    e26: 0,
    e27: 0,
    date1:0,
    date2:0,
    date3:0,
    date4:0,
    date5:0,
    date6:0,
    date7:0,
    date8:0,
    date9:0,
  });
  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
  
    setInputs({
      ...inputs,
      [id]: type === "number"
        ? (value === "" ? 0 : parseFloat(value) || 0)
        : value, // for text, date, etc.
    });
  };
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    setInputs({
      ...inputs,
      [id]: value || "",
    });
  };
  

  // handle save
  const handleSave = async (e) => {
    e.preventDefault();
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
      inputs: {
        ...inputs,
      },
    };

    try {
      const token = sessionStorage.getItem("authToken"); // ✅ Use sessionStorage
      if (!token) {
        toast.warn("No valid session found. Please log in.");
        return;
      }
      const response = await axiosInstance.post(
        "/fundposition",
        saveData,

      );
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




  useEffect(() => {
    // screen width check
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    }
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm text-center border border-yellow-200">

          {/* Icon circle */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-3xl">💻</span>
          </div>

          {/* Title */}
          <h2 className="mt-12 text-2xl font-extrabold text-gray-800">
            Desktop Only Feature
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-gray-600 leading-relaxed">
            Ye feature sirf <span className="font-semibold text-yellow-600">desktop screen</span> par available hai.
            Apne device ko desktop mode me open kare.
          </p>

          {/* Illustration */}
          <div className="mt-5 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
              alt="Desktop Icon"
              className="w-20 h-20 opacity-90"
            />
          </div>

          {/* Button */}
          <button
            onClick={() => toast.warn("Try opening on desktop!")}
            className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg shadow-md transition"
          >
            Okay, Got It!
          </button>
        </div>
      </div>

    );
  }

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
          <div className="table-container">
            <table className="">
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
