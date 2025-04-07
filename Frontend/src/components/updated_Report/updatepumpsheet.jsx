import React, { useEffect, useState } from "react";
import axiosInstance from '../Dashboard/axiosInstance'
import previousImage from "/previous.png";
import binImage from "/bin.png";
import saveImage from "/save.png";
import { Link, useNavigate, useParams } from "react-router-dom";

const UpdatePumpSheet = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [pumpSheetData, setPumpSheetData] = useState({
  });
  useEffect(() => {
    const fetchPumpSheetData = async () => {
      try {
        const response = await axiosInstance.get(
          `/mastersheet/pumpsheet/${id}`
        );
        setPumpSheetData(response.data);
        setLoading(false);
      } catch (err) {
        alert("Fetch nhh hora");
      } finally {
        setLoading(false);
      }
    };
    fetchPumpSheetData();
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

  if (!pumpSheetData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No report found...</p>
      </div>
    );
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPumpSheetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSave = async (e) => {
        e.preventDefault();
      try {
        const dta= {
            ...pumpSheetData
        }
        const response = await axiosInstance.put(
          `/mastersheet/pumpsheet/${id}`,
          dta
        );
        alert("Data saved successfully");
      } catch (err) {
        alert("Error saving data");
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
  
  const handleDelete = async () => {
    e.preventDefault()
    confirmDeleteToast(async () => {
      try {
        await axiosInstance.delete(`/mastersheet/pumpsheet/${id}`);
        alert("Report deleted successfully!");
        navigate("/mastersheet"); // Redirect to dashboard or another page
      } catch (error) {
        alert("Failed to delete report.");
      }
    })
  }

  return (
    <div>
      <h1 className="text-center text-xl p-4">PUMP REPORT SHEET</h1>
      <form>
        <div className="text-center mt-[-20px] text-xl p-4">
          <h1>
            Exceptional Report of{" "}
            {pumpSheetData.dat1}
          </h1>
          <h2>
            Reported on{" "}
            {pumpSheetData.dat2}
          </h2>
        </div>
        <div className="flex justify-evenly items-center  p-4">
          <Link to={"/mastersheet"}>
            <div className="">
              <img src={previousImage} width={50} alt="Back" />
            </div>
          </Link>

          <div>
            <img src={binImage} onClick={handleDelete} width={50} alt="Bin" />
          </div>

          <div>
            <button type="button">
              <img src={saveImage} onClick={handleSave} width={50} alt="Save" />
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
                  name="a1"
                  value={pumpSheetData.a1 || 0}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  name="a2"
                  value={pumpSheetData.a2}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  name="a3"
                  value={pumpSheetData.a3}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  name="a4"
                  value={pumpSheetData.a4}
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
                  name="b1"
                  value={pumpSheetData.b1}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="b2"
                  value={pumpSheetData.b2}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="b3"
                  value={pumpSheetData.b3}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="b4"
                  value={pumpSheetData.b4}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Sale for the day</td>
              <td>
                <input
                  type="number"
                  name="c1"
                  value={pumpSheetData.c1}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="c2"
                  value={pumpSheetData.c2}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="c3"
                  value={pumpSheetData.c3}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="c4"
                  value={pumpSheetData.c4}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Purchase up to date</td>
              <td>
                <input
                  type="number"
                  name="d1"
                  value={pumpSheetData.d1}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  name="d2"
                  value={pumpSheetData.d2}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  name="d3"
                  value={pumpSheetData.d3}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  name="d4"
                  value={pumpSheetData.d4}
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
                  name="e1"
                  value={pumpSheetData.e1}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  name="e2"
                  value={pumpSheetData.e2}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  name="e3"
                  value={pumpSheetData.e3}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  name="e4"
                  value={pumpSheetData.e4}
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
                  name="f1"
                  value={pumpSheetData.f1}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  name="f2"
                  value={pumpSheetData.f2}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  name="f3"
                  value={pumpSheetData.f3}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  name="f4"
                  value={pumpSheetData.f4}
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
                {pumpSheetData.dat3}
              </td>
            </tr>
            <tr>
              <td>
                Stock on{" "}
                {pumpSheetData.dat4}
              </td>
              <td>
                <input
                  type="number"
                  name="g1"
                  value={pumpSheetData.g1}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  name="g2"
                  value={pumpSheetData.g2}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  name="g3"
                  value={pumpSheetData.g3}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
              <td>
                <input
                  type="number"
                  name="g4"
                  value={pumpSheetData.g4}
                  onChange={handleInputChange}
                />
                Ltrs
              </td>
            </tr>
            <tr>
              <td>
                Indent for{" "}
                {pumpSheetData.dat5}
              </td>
              <td>
                <input
                  type="number"
                  name="h1"
                  value={pumpSheetData.h1}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  name="h2"
                  value={pumpSheetData.h2}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  name="h3"
                  value={pumpSheetData.h3}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  name="h4"
                  value={pumpSheetData.h4}
                  onChange={handleInputChange}
                />
                Kl
              </td>
            </tr>
            <tr>
              <td>
                Indent for{" "}
                {pumpSheetData.dat6}
              </td>
              <td>
                <input
                  type="number"
                  name="i1"
                  value={pumpSheetData.i1}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  name="i2"
                  value={pumpSheetData.i2}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  name="i3"
                  value={pumpSheetData.i3}
                  onChange={handleInputChange}
                />
                Kl
              </td>
              <td>
                <input
                  type="number"
                  name="i4"
                  value={pumpSheetData.i4}
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
                  name="j1"
                  value={pumpSheetData.j1}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  name="j2"
                  value={pumpSheetData.j2}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  name="j3"
                  value={pumpSheetData.j3}
                  onChange={handleInputChange}
                />
                Lac
              </td>
              <td>
                <input
                  type="number"
                  name="j4"
                  value={pumpSheetData.j4}
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

export default UpdatePumpSheet;
