import axios from "axios";
import React, { useEffect, useState,useContext } from "react";
import { Link } from "react-router-dom";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import UserContext from "../Home Page/UserContext"

const InFlowOutFlow = () => {
  const { user } = useContext(UserContext);
  const date = new Date().toDateString();
  const [inputs, setInputs] = useState({
    c46: 0,
    c47: 0,
    c48: 0,
    c49: 0,
    c50: 0,
    c51: 0,
    c52: 0,
    c53: 0,
    c54: 0,
    c55: 0,
    c56: 0,
    c57: 0,
    c58: 0,
    c59: 0,
    e46: 0,
    e47: 0,
    e48: 0,
    e49: 0,
    e50: 0,
    e51: 0,
    e52: 0,
    e53: 0,
    e54: 0,
    e55: 0,
    e56: 0,
    e57: 0,
    e58: 0,
    e59: 0,
    f46: "", // Initialize text inputs
    g46: "",
    f47: "",
    g47: "",
    f48: "",
    g48: "",
    f49: "",
    g49: "",
    f50: "",
    g50: "",
    f51: "",
    g51: "",
    f52: "",
    g52: "",
    f53: "",
    g53: "",
    f54: "",
    g54: "",
    f55: "",
    g55: "",
    f56: "",
    g56: "",
    f57: "",
    g57: "",
    b58: "",
    f58: "",
    g58: "",
    b59: "",
    f59: "",
    g59: "",
  
  });
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs({
      ...inputs,
      [id]: value === "" ? 0 : isNaN(value) ? value : parseFloat(value), // Set to 0 if input is empty, otherwise parse
    });
  };
  const inflowTotal =
    +inputs.c46 +
    inputs.c47 +
    inputs.c48 +
    inputs.c49 +
    inputs.c50 +
    inputs.c51 +
    inputs.c52 +
    inputs.c53 +
    inputs.c54 +
    inputs.c55 +
    inputs.c56 +
    inputs.c57 +
    inputs.c58 +
    inputs.c59;
  const outflowTotal =
    +inputs.e46 +
    inputs.e47 +
    inputs.e48 +
    inputs.e49 +
    inputs.e50 +
    inputs.e51 +
    inputs.e52 +
    inputs.e53 +
    inputs.e54 +
    inputs.e55 +
    inputs.e56 +
    inputs.e57 +
    inputs.e58 +
    inputs.e59;
  const OutFlow = inflowTotal - outflowTotal;
  const netFlowww = inflowTotal + outflowTotal;

   const loss = outflowTotal>inflowTotal ? outflowTotal - inflowTotal : 0;
   const profit = inflowTotal> outflowTotal ? inflowTotal - outflowTotal : 0;
  //save data to data
  const handleSavee = async (e) => {
    e.preventDefault();
    const saveData = {
      Profit: profit,
      Loss: loss,
      User: user?.username,
      Department: user?.department,
      Inflow: inflowTotal,
      Outflow: outflowTotal,
      NetFlow: netFlowww,
      inputs: {
        ...inputs,
      },
    };
    try {
      const token = sessionStorage.getItem("authToken"); // ✅ Use sessionStorage
      if (!token) {
        alert("No valid session found. Please log in.");
        return;
      }
      const response = await axios.post(
        "http://localhost:5500/bank/monthlyflow",
        saveData,
      );
      alert("Data Save Successfully ");
    } catch (error) {
      console.log(error);
      alert("Error !");
    }
  };

  return (
    <>
      <div className="text-center mt-10 text-2xl font-serif">
        <h1>
          {" "}
          <span className="text-green-600">In</span> Flow{" "}
          <span className="text-red-600">Out</span> Flow Transactions
        </h1>
        <h2>{date}</h2>
      </div>

      <div>
        <form onSubmit={handleSavee}>
          <div className="flex justify-evenly p-4">
            <Link to={"/sbbank"}>
              <div className="">
                <img src={previousImage} width={50} alt="Back" />
              </div>
            </Link>
            <div> 
             
            </div>
            <div>
              <button type="submit">
                <img src={saveImage} width={50} alt="Save" />
              </button>{" "}
            </div>
          </div>

         
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
                    id="c46"
                    value={inputs.c46}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e46"
                    value={inputs.e46}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f46"
                    value={inputs.f46}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g46"
                    value={inputs.g46}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>Recd. form Udaipur RT</td>
                <td>
                  <input
                    type="number"
                    id="c47"
                    value={inputs.c47}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e47"
                    value={inputs.e47}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f47"
                    value={inputs.f47}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g47"
                    value={inputs.g47}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>BPCL CR. RECD NOV 24</td>
                <td>
                  <input
                    type="number"
                    id="c48"
                    value={inputs.c48}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e48"
                    value={inputs.e48}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f48"
                    value={inputs.f48}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g48"
                    value={inputs.g48}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>Pictures Palace Udaipur</td>
                <td>
                  <input
                    type="number"
                    id="c49"
                    value={inputs.c49}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e49"
                    value={inputs.e49}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f49"
                    value={inputs.f49}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g49"
                    value={inputs.g49}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>Trust</td>
                <td>
                  <input
                    type="number"
                    id="c50"
                    value={inputs.c50}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e50"
                    value={inputs.e50}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f50"
                    value={inputs.f50}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g50"
                    value={inputs.g50}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>A.K Sanghi</td>
                <td>
                  <input
                    type="number"
                    id="c51"
                    value={inputs.c51}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e51"
                    value={inputs.e51}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f51"
                    value={inputs.f51}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g51"
                    value={inputs.g51}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>M.K Sanghi</td>
                <td>
                  <input
                    type="number"
                    id="c52"
                    value={inputs.c52}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e52"
                    value={inputs.e52}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f52"
                    value={inputs.f52}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g52"
                    value={inputs.g52}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>Smt. R Sanghi</td>
                <td>
                  <input
                    type="number"
                    id="c53"
                    value={inputs.c53}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e53"
                    value={inputs.e53}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f53"
                    value={inputs.f53}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g53"
                    value={inputs.g53}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>Pirates</td>
                <td>
                  <input
                    type="number"
                    id="c54"
                    value={inputs.c54}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e54"
                    value={inputs.e54}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f54"
                    value={inputs.f54}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g54"
                    value={inputs.g54}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>m K. Sanghi HUF</td>
                <td>
                  <input
                    type="number"
                    id="c55"
                    value={inputs.c55}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e55"
                    value={inputs.e55}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f55"
                    value={inputs.f55}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g55"
                    value={inputs.g55}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>Smt.Kanika Sanghi</td>
                <td>
                  <input
                    type="number"
                    id="c56"
                    value={inputs.c56}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e56"
                    value={inputs.e56}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f56"
                    value={inputs.f56}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g56"
                    value={inputs.g56}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Income Tax Refund</td>
                <td>
                  <input
                    type="number"
                    id="c57"
                    value={inputs.c57}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e57"
                    value={inputs.e57}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f57"
                    value={inputs.f57}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g57"
                    value={inputs.g57}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="b58"
                    value={inputs.b58}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="c58"
                    value={inputs.c58}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e58"
                    value={inputs.e58}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f58"
                    value={inputs.f58}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g58"
                    value={inputs.g58}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="b59"
                    value={inputs.b59}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="c59"
                    value={inputs.c59}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="e59"
                    value={inputs.e59}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="f59"
                    value={inputs.f59}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    id="g59"
                    value={inputs.g59}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>

              <tr>
                <td></td>
                <td>{inflowTotal}</td>
                <td>{outflowTotal}</td>
              </tr>
              <tr>
                <td></td>
                <td className="text-center p-4 text-2xl">
                  {OutFlow > 0 ? (
                    <span className="text-green-600">
                      {" "}
                      Inflow:${OutFlow.toFixed(2)}
                    </span>
                  ) : OutFlow < 0 ? (
                    <span className="text-red-600">
                      Outflow:${Math.abs(OutFlow).toFixed(2)}
                    </span>
                  ) : (
                    <span>No net flow</span>
                  )}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default InFlowOutFlow;
