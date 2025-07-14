import axiosInstance from '../Dashboard/axiosInstance'
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import previousImage from "/previous.png";
import saveImage from "/save.png";
import binImage from "/bin.png";

function SBI01Update() {
  // const date= new Date().toLocaleDateString();
  const navigate = useNavigate();
  const { id } = useParams();
  const [updtSbi, setUpdtSbi] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axiosInstance.get(
          `/fundposition/${id}`
        );
        setUpdtSbi(resp.data);
      } catch (error) {
        toast.warning(" Error fetching data");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
  }, [id]);
  const confirmDeleteToast = (onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this?</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                onConfirm();
                closeToast();
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
    );
  };
  const handleDelete = async (e) => {
    e.preventDefault()
    confirmDeleteToast(async () => {
      try {
        await axiosInstance.delete(`/fundposition/${id}`);
        navigate("/sbbank"); // Redirect to dashboard or another page
        toast.success("Report deleted successfully!");
      } catch (error) {
        toast.warn("Failed to delete report.");
      }
    })
  }

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

  if (!updtSbi) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p> No report found...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the user is allowed to edit
    //  if (!canEdit) {
    //   alert("You do not have permission to edit this report.");
    //   return; // Prevent state update
    // }
    // Convert the value to a number
    const numericValue = value === "" ? "" : Number(value);
    setUpdtSbi((prev) => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [name]: numericValue,
      },
    }));
  };

  const handleSaveSBI = async (e) => {
    const saveDatesbi = {
      ...updtSbi,
      Balance_Evening: updtSbi.CalculatedValue.balenv,
      Total_Fund_Stock: updtSbi.CalculatedValue.c34result,
      Working_Cappital: updtSbi.CalculatedValue.workingcap,
    };
    e.preventDefault();
    try {
      await axiosInstance.put(
        `/fundposition/${id}`,
        saveDatesbi
      ); // Adjust the URL as needed
      toast.success("Report updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.warn("Failed to update report.");
    }
  };

  updtSbi.CalculatedValue.totalsum =
    updtSbi.inputs.c6 +
    updtSbi.inputs.c7 +
    updtSbi.inputs.c8 +
    updtSbi.inputs.c9 +
    updtSbi.inputs.c10 +
    updtSbi.inputs.c11 +
    updtSbi.inputs.c12 +
    updtSbi.inputs.c13 +
    updtSbi.inputs.c14 +
    updtSbi.inputs.c15 +
    updtSbi.inputs.c16 +
    updtSbi.inputs.c17;

  updtSbi.CalculatedValue.j6result =
    +updtSbi.inputs.c6 -
    updtSbi.inputs.d6 -
    updtSbi.inputs.c27 -
    updtSbi.inputs.c26 -
    updtSbi.inputs.c25 -
    updtSbi.inputs.c24 +
    updtSbi.inputs.c13 +
    updtSbi.inputs.c14 +
    updtSbi.inputs.e16;

  updtSbi.CalculatedValue.j7result =
    +updtSbi.inputs.c7 +
    updtSbi.inputs.d6 +
    updtSbi.inputs.e17 -
    updtSbi.inputs.c21 -
    updtSbi.inputs.c22 -
    updtSbi.inputs.c23 +
    updtSbi.inputs.c11;

  updtSbi.CalculatedValue.j8result = +updtSbi.inputs.c8 - updtSbi.inputs.d8;
  updtSbi.CalculatedValue.j9result = +updtSbi.inputs.c9 - updtSbi.inputs.d9;
  updtSbi.CalculatedValue.j12result =
    updtSbi.j6result +
    updtSbi.j7result +
    updtSbi.j8result +
    updtSbi.j9result +
    updtSbi.inputs.j10 +
    updtSbi.inputs.j11;
  updtSbi.CalculatedValue.e16result = +updtSbi.inputs.c16;
  updtSbi.CalculatedValue.balenv =
    +updtSbi.CalculatedValue.totalsum -
    updtSbi.inputs.c21 -
    updtSbi.inputs.c22 -
    updtSbi.inputs.c23 -
    updtSbi.inputs.c25 -
    updtSbi.inputs.c27 -
    updtSbi.inputs.c26 -
    updtSbi.inputs.c24;

  updtSbi.CalculatedValue.c34result =
    updtSbi.inputs.c32 +
    updtSbi.inputs.c33 +
    updtSbi.CalculatedValue.balenv -
    updtSbi.inputs.c17 -
    updtSbi.inputs.c11 +
    updtSbi.inputs.c30;
  updtSbi.CalculatedValue.workingcap =
    +updtSbi.CalculatedValue.c34result -
    updtSbi.inputs.c35 -
    updtSbi.inputs.c36 -
    updtSbi.inputs.c37 -
    updtSbi.inputs.c38 -
    updtSbi.inputs.c39;
  updtSbi.CalculatedValue.e39result =
    +updtSbi.inputs.c35 +
    updtSbi.inputs.c36 +
    updtSbi.inputs.c37 +
    updtSbi.inputs.c38 +
    updtSbi.inputs.c39;

  return (
    <>
      <div className="text-center text-4xl p-4">
        <h1>
          Updated Fund Position of{" "}
          <span className="text-red-600">Sanghi Brothers</span>
        </h1>
        <h1>SB Bank position as on {updtSbi.createdAt.split("T")[0]}</h1>
        <div className="flex justify-evenly items-center  p-4">
          <Link to={"/sbbank"}>
            <div className="bg-transparent">
              <img src={previousImage} width={50} alt="Back" />
            </div>
          </Link>
          <button
            className="bg-transparent"
            type="button" // Change type to "button"
            onClick={handleDelete} // Call handleDelete on click
          ><img src={binImage} width={50} alt="Bin" />

          </button>
          <button className="bg-transparent"
            onClick={handleSaveSBI}
          >   <img src={saveImage} width={50} alt="Save" />

          </button>
        </div>
      </div>
      <div>
        <form>
          <div className="table-container">
            <table className="">
              <tbody>
                <tr>
                  <th>
                    <br />
                  </th>
                  <th>Name</th>
                  <th colSpan="2">Transfer</th>
                  <th colSpan="2">to a/c no.</th>
                  <th>Acc##</th>
                  <th>Closing Balance</th>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>SBI xxxx06421</td>
                  <td>
                    <input
                      name="c6"
                      type="number"
                      value={updtSbi.inputs.c6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      name="d6"
                      type="number"
                      value={updtSbi.inputs.d6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="e6"
                      value={updtSbi.inputs.e6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="f6"
                      value={updtSbi.inputs.f6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="i6"
                      value={updtSbi.inputs.i6}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>{updtSbi.CalculatedValue.j6result}</td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>SBIN000068037</td>
                  <td>
                    <input
                      type="number"
                      name="c7"
                      value={updtSbi.inputs.c7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="d7"
                      value={updtSbi.inputs.d7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e7"
                      value={updtSbi.inputs.e7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="f7"
                      value={updtSbi.inputs.f7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="i7"
                      value={updtSbi.inputs.i7}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>{updtSbi.CalculatedValue.j7result}</td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>SbI xxxxx5358</td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="c8"
                      value={updtSbi.inputs.c8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="d8"
                      value={updtSbi.inputs.d8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="e8"
                      value={updtSbi.inputs.e8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="f8"
                      value={updtSbi.inputs.f8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="i8"
                      value={updtSbi.inputs.i8}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>{updtSbi.CalculatedValue.j8result}</td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="c9"
                      value={updtSbi.inputs.c9}
                      onChange={handleInputChange}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      name="d9"
                      value={updtSbi.inputs.d9}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>{updtSbi.CalculatedValue.j9result.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Card payment not cr.by paytm/icici</td>
                  <td>
                    <input
                      type="number"
                      name="c10"
                      value={updtSbi.inputs.c10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="d10"
                      value={updtSbi.inputs.d10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e10"
                      value={updtSbi.inputs.e10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="f10"
                      value={updtSbi.inputs.f10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="i10"
                      value={updtSbi.inputs.i10}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="j10"
                      value={updtSbi.inputs.j10}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>cash deposit in m/c from evening shift</td>
                  <td>
                    <input
                      type="number"
                      name="c11"
                      value={updtSbi.inputs.c11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="d11"
                      value={updtSbi.inputs.d11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e11"
                      value={updtSbi.inputs.e11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="f11"
                      value={updtSbi.inputs.f11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="i11"
                      value={updtSbi.inputs.i11}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="j11"
                      value={updtSbi.inputs.j11}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>cash in hand of Yesterday for deposit </td>
                  <td>
                    <input
                      type="number"
                      name="c12"
                      value={updtSbi.inputs.c12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="d12"
                      value={updtSbi.inputs.d12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e12"
                      value={updtSbi.inputs.e12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="f12"
                      value={updtSbi.inputs.f12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="i12"
                      value={updtSbi.inputs.i12}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>{updtSbi.CalculatedValue.j12result.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Recd.from s.v</td>
                  <td>
                    <input
                      type="number"
                      name="c13"
                      value={updtSbi.inputs.c13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="d13"
                      value={updtSbi.inputs.d13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e13"
                      value={updtSbi.inputs.e13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="f13"
                      value={updtSbi.inputs.f13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="i13"
                      value={updtSbi.inputs.i13}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="j13"
                      value={updtSbi.inputs.j13}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Recd.from Mukund Sanghi </td>
                  <td>
                    <input
                      type="number"
                      name="c14"
                      value={updtSbi.inputs.c14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="d14"
                      value={updtSbi.inputs.d14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e14"
                      value={updtSbi.inputs.e14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="f14"
                      value={updtSbi.inputs.f14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="i14"
                      value={updtSbi.inputs.i14}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="j14"
                      value={updtSbi.inputs.j14}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>other deposits</td>
                  <td>
                    <input
                      type="number"
                      name="c15"
                      value={updtSbi.inputs.c15}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>Deposit</td>
                  <td>to a/c no.</td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>cash of Yesterday for deposit in othe a/c </td>
                  <td>
                    <input
                      type="number"
                      name="c16"
                      value={updtSbi.inputs.c16}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>{updtSbi.CalculatedValue.e16result.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      name="f16"
                      value={updtSbi.inputs.f16}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Today 1 shift Amt.deposit in a/c</td>
                  <td>
                    <input
                      type="number"
                      name="c17"
                      value={updtSbi.inputs.c17}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e17"
                      value={updtSbi.inputs.e17}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="f17"
                      value={updtSbi.inputs.f17}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Total</td>
                  <td>{updtSbi.CalculatedValue.totalsum.toFixed(2)}</td>
                </tr>
                <tr>
                  <br />
                </tr>
                <tr>
                  <br />
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td> payment to bpcl for invoice 21-12</td>
                  <td>
                    <input
                      type="number"
                      name="c21"
                      value={updtSbi.inputs.c21}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td> payment to bpcl for invoice 00-12</td>
                  <td>
                    <input
                      type="number"
                      name="c22"
                      value={updtSbi.inputs.c22}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td> payment to bpcl for invoice 00-12</td>
                  <td>
                    <input
                      type="number"
                      name="c23"
                      value={updtSbi.inputs.c23}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Pd to Hearing healthcare</td>
                  <td>
                    <input
                      type="number"
                      name="c24"
                      value={updtSbi.inputs.c24}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e24"
                      value={updtSbi.inputs.e24}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Pd to A.K.SANGHI</td>
                  <td>
                    <input
                      type="number"
                      name="c25"
                      value={updtSbi.inputs.c25}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <br />
                  </td>

                  <td>
                    <input
                      type="number"
                      name="e25"
                      value={updtSbi.inputs.e25}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Pd to GST OF PP</td>
                  <td>
                    <input
                      type="number"
                      name="c26"
                      value={updtSbi.inputs.c26}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e26"
                      value={updtSbi.inputs.e26}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Pd FOR AIR COPRESSOR</td>
                  <td>
                    <input
                      type="number"
                      name="c27"
                      value={updtSbi.inputs.c27}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e27"
                      value={updtSbi.inputs.e27}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Balance in evening</td>
                  <td>{updtSbi.CalculatedValue.balenv.toFixed(2)}</td>
                </tr>
                <tr>
                  <br />
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>
                    <br />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="c30"
                      value={updtSbi.inputs.c30}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <br />
                </tr>
                <tr>
                  <td>
                    <input
                      type="number"
                      name="a32"
                      value={updtSbi.inputs.a32}
                      onChange={handleInputChange}
                    />
                  </td>

                  <td>Today morning stock value of petrol</td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="c32"
                      value={updtSbi.inputs.c32}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="d32"
                      value={updtSbi.inputs.d32}
                      onChange={handleInputChange}
                    />{" "}
                    per Ltr rate
                  </td>
                </tr>
                <tr>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="a33"
                      value={updtSbi.inputs.a33}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>Petrol PUR for the Day</td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="c33"
                      value={updtSbi.inputs.c33}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Total Fund including stock</td>
                  <td> {updtSbi.CalculatedValue.c34result.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Due payment to bpcl for invoice 00-12</td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="c35"
                      value={updtSbi.inputs.c35}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Due payment to bpcl for invoice 00-12</td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="c36"
                      value={updtSbi.inputs.c36}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Due payment to bpcl for invoice 00-12</td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="c37"
                      value={updtSbi.inputs.c37}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Due payment to bpcl for invoice 00-12</td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="c38"
                      value={updtSbi.inputs.c38}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>Due payment to bpcl for OIL invoice </td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      name="c39"
                      value={updtSbi.inputs.c39}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>{updtSbi.createdAt.split("T")[0]}</td>
                  <td>
                    {updtSbi.CalculatedValue.e39result.toFixed(2)} <br />
                    TOTAL DUE as on AS PER BPCL <br />
                    LEDGER CR.RECd
                  </td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                  <td>working capital</td>
                  <td>{updtSbi.CalculatedValue.workingcap.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>
                    <br />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </div >
    </>
  );
}

export default SBI01Update;
