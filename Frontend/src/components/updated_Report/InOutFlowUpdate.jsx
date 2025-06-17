import axiosInstance from '../Dashboard/axiosInstance'
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import binImage from "/bin.png";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const InOutFlowUpdate = () => {
  const navigate = useNavigate();
  const [floww, setfloww] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchflow = async () => {
      try {
        const token = sessionStorage.getItem("authToken"); // ✅ Use sessionStorage
        if (!token) {
          toast.warning("No valid session found. Please log in.");
          return;
        }
        const response = await axiosInstance.get(
          `/bank/monthlyflow/${id}`
        );

        setfloww(response.data);
      } catch (error) {
        toast.warn("An error occurred. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchflow();
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

  if (!floww) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p> No report found...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let storedValue;
    if (value === "") {
      storedValue = ""; // Keep it as an empty string
    } else {
      const parsedValue = Number(value);
      storedValue = isNaN(parsedValue) ? value : parsedValue; // Use the original string if it's not a number
    }

    setfloww((prev) => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [name]: storedValue,
      },
    }));
  };

  floww.inflowTotal =
    +floww.inputs.c46 +
    floww.inputs.c47 +
    floww.inputs.c48 +
    floww.inputs.c49 +
    floww.inputs.c50 +
    floww.inputs.c51 +
    floww.inputs.c52 +
    floww.inputs.c53 +
    floww.inputs.c54 +
    floww.inputs.c55 +
    floww.inputs.c56 +
    floww.inputs.c57 +
    floww.inputs.c58 +
    floww.inputs.c59;
  floww.outflowTotal =
    +floww.inputs.e46 +
    floww.inputs.e47 +
    floww.inputs.e48 +
    floww.inputs.e49 +
    floww.inputs.e50 +
    floww.inputs.e51 +
    floww.inputs.e52 +
    floww.inputs.e53 +
    floww.inputs.e54 +
    floww.inputs.e55 +
    floww.inputs.e56 +
    floww.inputs.e57 +
    floww.inputs.e58 +
    floww.inputs.e59;

  floww.OutFlow = floww.inflowTotal - floww.outflowTotal;
  floww.netFlowww = floww.inflowTotal + floww.outflowTotal;
  floww.loss =
    floww.outflowTotal > floww.inflowTotal
      ? floww.outflowTotal - floww.inflowTotal
      : 0;
  floww.profit =
    floww.inflowTotal > floww.outflowTotal
      ? floww.inflowTotal - floww.outflowTotal
      : 0;
  //save data to data
  const handleSavee = async (e) => {
    e.preventDefault();
    const saveData = {
      ...floww,
      Profit: floww.profit,
      Loss: floww.loss,
      Inflow: floww.inflowTotal,
      Outflow: floww.outflowTotal,
      NetFlow: floww.netFlowww,
    };
    try {
      const response = await axiosInstance.put(
        `/bank/monthlyflow/${id}`,
        saveData
      );
      toast.success("Data saved successfully");
      setIsEditing(false);
    } catch (error) {
      toast.warn("Error saving data!");
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
    e.preventDefault()
    confirmDeleteToast(async () => {
      try {
        await axiosInstance.delete(`/bank/monthlyflow/${id}`);
        navigate("/sbbank"); // Redirect to dashboard or another page
        toast.success("Report deleted successfully!");
      } catch (error) {
        toast.warn("Failed to delete report.");
      }
    })
  }

  return (
    <>
      <div className="text-center mt-10 text-2xl font-serif">
        <h1>
          {" "}
          <span className="text-green-600">In</span> Flow{" "}
          <span className="text-red-600">Out</span> Flow Transactions
        </h1>
        <h2>{floww.createdAt}</h2>
      </div>

      <div>
        <form onSubmit={handleSavee}>
          <div className="flex justify-evenly p-4">
            <Link to={"/sbbank"}>
              <div className="">
                <img src={previousImage} width={50} alt="Back" />
              </div>
            </Link>
            <div className='bg-transparent'>
              {" "}
              <img
                onClick={handleDelete}
                src={binImage}
                width={50}
                alt="Delete"
              />
            </div>
            <div >
              <button className="bg-transparent" type="submit">
                <img src={saveImage} width={50} alt="Save" />
              </button>{" "}
            </div>
          </div>
         
          <div>
            <table>
              <tbody>
                <tr>
                  <th>During the Month Payement Records</th>
                  <th>In Flow </th>
                  <th>Out Flow</th>
                  <th>Transfer To</th>
                  <th>Transfer To</th>
                </tr>

                <tr>
                  <td>Sanghi Venture</td>
                  <td>
                    <input
                      type="number"
                      name="c46"
                      value={floww.inputs.c46}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e46"
                      value={floww.inputs.e46}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f46"
                      value={floww.inputs.f46}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g46"
                      value={floww.inputs.g46}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Recd. form Udaipur RT</td>
                  <td>
                    <input
                      type="number"
                      name="c47"
                      value={floww.inputs.c47}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e47"
                      value={floww.inputs.e47}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f47"
                      value={floww.inputs.f47}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g47"
                      value={floww.inputs.g47}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>BPCL CR. RECD</td>
                  <td>
                    <input
                      type="number"
                      name="c48"
                      value={floww.inputs.c48}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e48"
                      value={floww.inputs.e48}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f48"
                      value={floww.inputs.f48}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g48"
                      value={floww.inputs.g48}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Pictures Palace Udaipur</td>
                  <td>
                    <input
                      type="number"
                      name="c49"
                      value={floww.inputs.c49}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e49"
                      value={floww.inputs.e49}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f49"
                      value={floww.inputs.f49}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g49"
                      value={floww.inputs.g49}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Trust</td>
                  <td>
                    <input
                      type="number"
                      name="c50"
                      value={floww.inputs.c50}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e50"
                      value={floww.inputs.e50}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f50"
                      value={floww.inputs.f50}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g50"
                      value={floww.inputs.g50}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>A.K Sanghi</td>
                  <td>
                    <input
                      type="number"
                      name="c51"
                      value={floww.inputs.c51}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e51"
                      value={floww.inputs.e51}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f51"
                      value={floww.inputs.f51}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g51"
                      value={floww.inputs.g51}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>M.K Sanghi</td>
                  <td>
                    <input
                      type="number"
                      name="c52"
                      value={floww.inputs.c52}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e52"
                      value={floww.inputs.e52}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f52"
                      value={floww.inputs.f52}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g52"
                      value={floww.inputs.g52}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Smt. R Sanghi</td>
                  <td>
                    <input
                      type="number"
                      name="c53"
                      value={floww.inputs.c53}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e53"
                      value={floww.inputs.e53}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f53"
                      value={floww.inputs.f53}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g53"
                      value={floww.inputs.g53}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Pirates</td>
                  <td>
                    <input
                      type="number"
                      name="c54"
                      value={floww.inputs.c54}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e54"
                      value={floww.inputs.e54}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f54"
                      value={floww.inputs.f54}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g54"
                      value={floww.inputs.g54}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>m K. Sanghi HUF</td>
                  <td>
                    <input
                      type="number"
                      name="c55"
                      value={floww.inputs.c55}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e55"
                      value={floww.inputs.e55}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f55"
                      value={floww.inputs.f55}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g55"
                      value={floww.inputs.g55}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Smt.Kanika Sanghi</td>
                  <td>
                    <input
                      type="number"
                      name="c56"
                      value={floww.inputs.c56}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e56"
                      value={floww.inputs.e56}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f56"
                      value={floww.inputs.f56}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g56"
                      value={floww.inputs.g56}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Income Tax Refund</td>
                  <td>
                    <input
                      type="number"
                      name="c57"
                      value={floww.inputs.c57}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e57"
                      value={floww.inputs.e57}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f57"
                      value={floww.inputs.f57}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g57"
                      value={floww.inputs.g57}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="b58"
                      value={floww.inputs.b58}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="c58"
                      value={floww.inputs.c58}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e58"
                      value={floww.inputs.e58}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f58"
                      value={floww.inputs.f58}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g58"
                      value={floww.inputs.g58}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="b59"
                      value={floww.inputs.b59}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="c59"
                      value={floww.inputs.c59}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="e59"
                      value={floww.inputs.e59}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="f59"
                      value={floww.inputs.f59}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      name="g59"
                      value={floww.inputs.g59}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td>{floww.inflowTotal}</td>
                  <td>{floww.outflowTotal}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="text-center p-4 text-2xl">
                    {floww.OutFlow > 0 ? (
                      <span className="text-green-600">
                        {" "}
                        Inflow:Rs💰{floww.OutFlow.toFixed(2)}
                      </span>
                    ) : floww.OutFlow < 0 ? (
                      <span className="text-red-600">
                        Outflow:Rs💰{Math.abs(floww.OutFlow).toFixed(2)}
                      </span>
                    ) : (
                      <span>No net flow</span>
                    )}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </>
  );
};

export default InOutFlowUpdate;
