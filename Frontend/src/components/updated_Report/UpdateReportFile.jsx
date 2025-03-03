import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import binImage from "/bin.png";

const UpdateReportFile = () => {
  const { id } = useParams();
  const [upreportfile, setUpReportfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userDepartment, setUserDepartment] = useState("");
  const navigate = useNavigate();
  const date = new Date();
  const getNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay.toLocaleTimeString;
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`http://localhost:5500/reportfile/${id}`);
        setUpReportfile(response.data);
      } catch (error) {
        console.error("Error fetching report:", error);
        alert("update api kaam nhh krrha.................");
      } finally {
        setLoading(false);
      }
    };

    const Profile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5500/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDepartment(response.data.department);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Failed to fetch user profile.");
      }
    };

    fetchReport();
    Profile();
  }, [id]);

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

  const canEdit = userDepartment === upreportfile.department;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (!canEdit) {
      alert("You do not have permission to edit this report.");
      return;
    }

    const numericValue = value === "" ? "" : Number(value);
    setUpReportfile((prev) => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [name]: numericValue,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5500/reportfile/${id}`, upreportfile);
      alert("Report updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Failed to update report.");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await axios.delete(`http://localhost:5500/reportfile/${id}`);
        alert("Report deleted successfully!");
        navigate("/dashboard");
        setIsEditing(false);
      } catch (error) {
        alert("Failed to delete report.");
      }
    }
  };

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

  return (
    <div>
      <div>
        <h1 className="text-3xl mt-5  font-thin text-center  text-red-950  mb-4">
          Report File
        </h1>
        <div className="flex justify-evenly items-center  p-4">
          <Link to={"/dashboard"}>
            <div className="">
              <img src={previousImage} width={50} alt="Back" />
            </div>
          </Link>
          <button className="py-3  px-4 inline-flex items-center gap-x-2 text-xl bg-red-500 font-medium rounded-lg  ">
            {upreportfile.department}
          </button>
          <button>
            <img src={binImage} alt="BIN" width={50} onClick={handleDelete} />
          </button>
          <button className="py-3  px-4 inline-flex bg-red-500 items-center gap-x-2 text-xl  font-medium rounded-lg">
            {upreportfile.entryDate.split("T")[0]}
          </button>
          <button type="submit">
            <img src={saveImage} onClick={handleSave} width={50} alt="Save" />
          </button>
        </div>
      </div>
      <div className="flex justify-around">
        <div>
          <table className="font-serif text-center">
            <tbody>
              <tr className="text-xl ">
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
              <tr>
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
      </div>
    </div>
  );
};

export default UpdateReportFile;