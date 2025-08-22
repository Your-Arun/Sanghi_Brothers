import React, { useEffect, useState } from "react";
import axiosInstance from '../Dashboard/axiosInstance'
import { Link, useNavigate, useParams } from "react-router-dom";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import binImage from "/bin.png";
import { toast } from "react-toastify";

const UpdateReportFile = () => {
  const { id } = useParams();
  const [upreportfile, setUpReportfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const date = new Date();
  const getNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay.toLocaleTimeString;
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axiosInstance.get(`/reportfile/${id}`);
        setUpReportfile(response.data);
      } catch (error) {
        toast.warning("Not fetching");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);
  useEffect(() => {
    // screen width check
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    }
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="animate-spin inline-block size-20 border-[6px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  if (!upreportfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No report found...</p>
      </div>
    );
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const parsedValue =
      value === "" ? "" : !isNaN(value) && value.trim() !== "" ? Number(value) : value;

    setUpReportfile((prev) => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [name]: parsedValue,
      },
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/reportfile/${id}`, upreportfile);
      toast.success("Report updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.warn("Failed to update report.");
    }
  };
  const confirmDeleteToast = (onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this ?</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                onConfirm()
                closeToast()
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    )
  }
  const handleDelete = async (e) => {
    e.preventDefault();
    confirmDeleteToast(async () => {
      try {
        await axiosInstance.delete(`/reportfile/${id}`);
        toast.success("Report deleted successfully!");
        navigate("/dashboard");
        setIsEditing(false);
      } catch (error) {
        toast.warn("Failed to delete report.");
      }
    })
  }
  const calculateReports = () => {
    upreportfile.reports.b4result =
      upreportfile.inputs.c4 +
      upreportfile.inputs.d4 +
      upreportfile.inputs.e4 +
      upreportfile.inputs.f4 +
      upreportfile.inputs.g4 +
      upreportfile.inputs.h4;
    upreportfile.reports.b5result =
      upreportfile.inputs.c5 +
      upreportfile.inputs.d5 +
      upreportfile.inputs.e5 +
      upreportfile.inputs.f5 +
      upreportfile.inputs.g5 +
      upreportfile.inputs.h5;
    upreportfile.reports.b6result =
      upreportfile.reports.b4result + upreportfile.reports.b5result;
    upreportfile.reports.c6result =
      upreportfile.inputs.c4 + upreportfile.inputs.c5;
    upreportfile.reports.d6result =
      upreportfile.inputs.d4 + upreportfile.inputs.d5;
    upreportfile.reports.e6result =
      upreportfile.inputs.e4 + upreportfile.inputs.e5;
    upreportfile.reports.f6result =
      upreportfile.inputs.f4 + upreportfile.inputs.f5;
    upreportfile.reports.g6result =
      upreportfile.inputs.g4 + upreportfile.inputs.g5;
    upreportfile.reports.h6result =
      upreportfile.inputs.h4 + upreportfile.inputs.h5;
    upreportfile.reports.stockrecord =
      upreportfile.inputs.b3 + upreportfile.inputs.b14 - upreportfile.inputs.b12;
    upreportfile.reports.perdip =
      upreportfile.inputs.c8 +
      upreportfile.inputs.d8 +
      upreportfile.inputs.e8 +
      upreportfile.inputs.f8;
    upreportfile.reports.variance =
      upreportfile.reports.perdip - upreportfile.reports.stockrecord;
    upreportfile.reports.perVar =
      upreportfile.inputs.b12 !== 0
        ? (
          (upreportfile.reports.variance / upreportfile.inputs.b12) *
          100
        ).toFixed(2)
        : 0;
    upreportfile.reports.avgmonth =
      upreportfile.inputs.b12 !== 0
        ? (upreportfile.inputs.b12 / 11).toFixed(2)
        : 0;
    upreportfile.reports.avgdiff =
      upreportfile.reports.avgmonth - upreportfile.inputs.b16;
    upreportfile.reports.cashsales =
      upreportfile.reports.b6result - upreportfile.inputs.b43;

    upreportfile.reports.ftera =
      upreportfile.inputs.f13 !== 0
        ? ((upreportfile.inputs.f12 / upreportfile.inputs.f13) * 100).toFixed(2)
        : 0;
    upreportfile.reports.gtera =
      upreportfile.inputs.g13 !== 0
        ? ((upreportfile.inputs.g12 / upreportfile.inputs.g13) * 100).toFixed(2)
        : 0;

    upreportfile.reports.htera =
      upreportfile.inputs.h13 !== 0
        ? ((upreportfile.inputs.h12 / upreportfile.inputs.h13) * 100).toFixed(2)
        : 0;

    upreportfile.reports.feighteen =
      upreportfile.inputs.f14 !== 0
        ? (upreportfile.inputs.f13 / 31).toFixed(2)
        : 0;
    upreportfile.reports.geighteen =
      upreportfile.inputs.g14 !== 0
        ? (upreportfile.inputs.g13 / 31).toFixed(2)
        : 0;
    upreportfile.reports.heighteen =
      upreportfile.inputs.h14 !== 0
        ? (upreportfile.inputs.h13 / 31).toFixed(2)
        : 0;
  };
  calculateReports();
  const currentYear = new Date().getFullYear();
  const year1 = currentYear - 1;
  const year2 = currentYear - 2;
  const year3 = currentYear - 3;

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
      <div className="flex items-center justify-center p-6 ">
        <form>
          <div>
            <h1 className="text-5xl text-center font-bold  mb-4">
              Report File
            </h1>
            <div className="flex justify-evenly items-center  p-4">
              <Link to={"/dashboard"}>
                <div className="">
                  <img src={previousImage} width={50} alt="Back" />
                </div>
              </Link>
              <div className="bg-transparent">
                <img src={binImage} alt="BIN" width={50} onClick={handleDelete} />
              </div>
              <div className="py-3 text-black  px-4 inline-flex items-center gap-x-2 text-xl rounded-lg">
                {upreportfile.entryDate.split("T")[0]}
              </div>
              <button type="submit" className="bg-transparent" >
                <img src={saveImage} onClick={handleSave} width={50} alt="Save" />
              </button>
            </div>
          </div>
          <div className="table-container">
            <div className="">
              <table>
                <thead>
                  <tr>
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
                </thead>
                <tbody>
                  <tr>
                    <td>Opening Stock</td>
                    <td>
                      <input
                        type="Number"
                        name="b3"
                        value={upreportfile.inputs.b3}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                      Litre
                    </td>
                  </tr>
                  <tr>
                    <td>Shift -1</td>
                    <td className="bfour" id="b4">
                      <div id="b4results">{upreportfile.reports.b4result}</div>
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="c4"
                        value={upreportfile.inputs.c4}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="d4"
                        value={upreportfile.inputs.d4}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="e4"
                        value={upreportfile.inputs.e4}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="f4"
                        value={upreportfile.inputs.f4}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="g4"
                        value={upreportfile.inputs.g4}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="h4"
                        value={upreportfile.inputs.h4}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Shift -2</td>
                    <td className="bfive" id="b5">
                      <div id="b5results">{upreportfile.reports.b5result}</div>
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="c5"
                        value={upreportfile.inputs.c5}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="d5"
                        value={upreportfile.inputs.d5}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="e5"
                        value={upreportfile.inputs.e5}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="f5"
                        value={upreportfile.inputs.f5}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="g5"
                        value={upreportfile.inputs.g5}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="h5"
                        value={upreportfile.inputs.h5}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td>Total Sales</td>
                    <td className="bsix" id="b6">
                      {upreportfile.reports.b6result}
                    </td>
                    <td>{upreportfile.reports.c6result}</td>
                    <td>{upreportfile.reports.d6result}</td>
                    <td>{upreportfile.reports.e6result}</td>
                    <td>{upreportfile.reports.f6result}</td>
                    <td>{upreportfile.reports.g6result}</td>
                    <td>{upreportfile.reports.h6result}</td>
                  </tr>
                  <tr>
                    <td>Stock as per Record</td>
                    <td>
                      <div>{upreportfile.reports.stockrecord}</div>
                    </td>
                    <td>Tank 1</td>
                    <td>Tank 2</td>
                    <td>In lorry</td>
                    <td>water/ms</td>
                  </tr>
                  <tr>
                    <td>Stock as per dip</td>
                    <td>{upreportfile.reports.perdip}</td>
                    <td>
                      <input
                        type="Number"
                        name="c8"
                        value={upreportfile.inputs.c8}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="e8"
                        value={upreportfile.inputs.e8}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="d8"
                        value={upreportfile.inputs.d8}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="f8"
                        value={upreportfile.inputs.f8}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Vairance +/-</td>
                    <td>{upreportfile.reports.variance}</td>
                    <td>{upreportfile.reports.perVar}</td>
                  </tr>
                  <tr>
                    <td>Avg. for the month</td>
                    <td>{upreportfile.reports.avgmonth}</td>
                  </tr>
                  <tr>
                    <td>Sale target</td>
                    <td>
                      <input
                        type="Number"
                        name="b11"
                        value={upreportfile.inputs.b11}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Actual sale till date</td>
                    <td>
                      <input
                        type="Number"
                        name="b12"
                        value={upreportfile.inputs.b12}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Pur. target last yr</td>
                    <td>
                      <input
                        type="Number"
                        name="b13"
                        value={upreportfile.inputs.b13}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Pur till date</td>
                    <td>
                      <input
                        type="Number"
                        name="b14"
                        value={upreportfile.inputs.b14}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Our Target</td>
                    <td>
                      <input
                        type="Number"
                        name="b15"
                        value={upreportfile.inputs.b15}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>If avg is</td>
                    <td>
                      <input
                        type="Number"
                        name="b16"
                        value={upreportfile.inputs.b16}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Avg Diff.</td>
                    <td>
                      <input
                        type="Number"
                        name="b17"
                        value={upreportfile.inputs.b17}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Pdp for Today</td>
                    <td>
                      <input
                        type="Number"
                        name="b18"
                        value={upreportfile.inputs.b18}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Pdp for Next day <span>{getNextDay()}</span>
                    </td>
                    <td>
                      <input
                        type="Number"
                        name="b19"
                        value={upreportfile.inputs.b19}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>New Rate Today</td>
                    <td>
                      <input
                        type="Number"
                        name="b20"
                        value={upreportfile.inputs.b20}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Old Rate</td>
                    <td>
                      <input
                        type="Number"
                        name="b21"
                        value={upreportfile.inputs.b21}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>2T 1ltr</td>
                    <td>
                      <input
                        type="Number"
                        name="b22"
                        value={upreportfile.inputs.b22}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>2t 500ml</td>
                    <td>
                      <input
                        type="Number"
                        name="b23"
                        value={upreportfile.inputs.b23}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>2T 250ml</td>
                    <td>
                      <input
                        type="Number"
                        name="b24"
                        value={upreportfile.inputs.b24}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>60ml pouch sold</td>
                    <td>
                      <input
                        type="Number"
                        name="b25"
                        value={upreportfile.inputs.b25}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>40ml pouch sold</td>
                    <td>
                      <input
                        type="Number"
                        name="b26"
                        value={upreportfile.inputs.b26}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>20ml pouch sold</td>
                    <td>
                      <input
                        type="Number"
                        name="b27"
                        value={upreportfile.inputs.b27}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Classic 1 Ltr sold</td>
                    <td>
                      <input
                        type="Number"
                        name="b28"
                        value={upreportfile.inputs.b28}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Nxt 1 Ltr</td>
                    <td>
                      <input
                        type="Number"
                        name="b29"
                        value={upreportfile.inputs.b29}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Nxt 900ml</td>
                    <td>
                      <input
                        type="Number"
                        name="b30"
                        value={upreportfile.inputs.b30}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>4T Plus 1 ltr</td>
                    <td>
                      <input
                        type="Number"
                        name="b31"
                        value={upreportfile.inputs.b31}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>4T Plus 900ml</td>
                    <td>
                      <input
                        type="Number"
                        name="b32"
                        value={upreportfile.inputs.b32}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>4T Zipp 1 Ltr</td>
                    <td>
                      <input
                        type="Number"
                        name="b33"
                        value={upreportfile.inputs.b33}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>4T Zipp 900ml</td>
                    <td>
                      <input
                        type="Number"
                        name="b34"
                        value={upreportfile.inputs.b34}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Stotech</td>
                    <td>
                      <input
                        type="Number"
                        name="b35"
                        value={upreportfile.inputs.b35}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Hero Honda 800ml</td>
                    <td>
                      <input
                        type="Number"
                        name="b36"
                        value={upreportfile.inputs.b36}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Hero Honda 900ml</td>
                    <td>
                      <input
                        type="Number"
                        name="b37"
                        value={upreportfile.inputs.b37}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Ready cool 1 Ltr</td>
                    <td>
                      <input
                        type="Number"
                        name="b38"
                        value={upreportfile.inputs.b38}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Ready cool 500ml</td>
                    <td>
                      <input
                        type="Number"
                        name="b39"
                        value={upreportfile.inputs.b39}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>60ml pouch leakage</td>
                    <td>
                      <input
                        type="Number"
                        name="b40"
                        value={upreportfile.inputs.b40}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>40ml pouch leakage</td>
                    <td>
                      <input
                        type="Number"
                        name="b41"
                        value={upreportfile.inputs.b41}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>20ml pouch leakage</td>
                    <td>
                      <input
                        type="Number"
                        name="b42"
                        value={upreportfile.inputs.b42}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Today Credit Sold</td>
                    <td>
                      <input
                        type="Number"
                        name="b43"
                        value={upreportfile.inputs.b43}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Today Cash Sales</td>
                    <td id="b44">{upreportfile.reports.cashsales}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="table-container">
              <div className="text-center mb-20">
                <h2 className="text-2xl font-bold  p-4">This Month , Last year</h2>
                <table>
                  <thead>
                    {" "}
                    <tr>
                      <th>{year1}</th>
                      <th>{year2}</th>
                      <th>{year3}</th>
                      <th>Last 3 Years</th>
                    </tr>
                  </thead>
                  <tbody>
                    {" "}
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="f12"
                          value={upreportfile.inputs.f12}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="g12"
                          value={upreportfile.inputs.g12}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="h12"
                          value={upreportfile.inputs.h12}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td className="font-bold">
                        <input
                          type="text"
                          name="i12"
                          value={upreportfile.inputs.i12}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">{upreportfile.reports.ftera}</td>
                      <td className="font-bold">{upreportfile.reports.gtera}</td>
                      <td className="font-bold">{upreportfile.reports.htera}</td>
                      <td className="font-bold">
                        <input
                          type="text"
                          name="i13"
                          value={upreportfile.inputs.i13}
                          placeholder="% on sale"
                          onChange={handleInputChange}
                        />
                      </td>
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
                          name="f13"
                          value={upreportfile.inputs.f13}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="g13"
                          value={upreportfile.inputs.g13}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="h13"
                          value={upreportfile.inputs.h13}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td className="font-bold">
                        <input
                          type="text"
                          name="i14"
                          value={upreportfile.inputs.i14}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="f14"
                          value={upreportfile.inputs.f14}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="g14"
                          value={upreportfile.inputs.g14}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="h14"
                          value={upreportfile.inputs.h14}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td className="font-bold">
                        <input
                          type="text"
                          name="i15"
                          value={upreportfile.inputs.i15}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>{upreportfile.reports.feighteen}</td>
                      <td>{upreportfile.reports.geighteen}</td>
                      <td>{upreportfile.reports.heighteen}</td>
                      <td className="font-bold">
                        <input
                          type="text"
                          name="i16"
                          value={upreportfile.inputs.i16}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateReportFile;