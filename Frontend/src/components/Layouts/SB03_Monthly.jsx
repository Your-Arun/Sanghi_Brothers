import axiosInstance from '../Dashboard/axiosInstance'
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import UserContext from "../Home Page/UserContext"
import { toast } from 'react-toastify'

const SB03_Monthly = () => {
  const { user } = useContext(UserContext);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 0; // 1-indexed (1 = January, 12 = December)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();


  // Initialize state for inputs
  const [inputs, setInputs] = useState(
    Array.from({ length: daysInMonth }, () => ({
      datee: "",
      j: 0,
      k: 0,
      l: 0,
      m: 0,
      totalStockTank1: 0,
      totalStockTank2: 0,
      p: 0,
      q: 0,
      closingStockTank1: 0,
      closingStockTank2: 0,
      TotalStockk: 0,
      Salee: 0,
      w: 0,
      x: 0,
      SaleShift2: 0,
      TotalTank12: 0,
      aa: 0,
      Tank1variance: 0,
      ac: 0,
      Tank2variance: 0,
      BothTankVariance: 0,
      af: 0,
      ag: 0,
      ah: 0,
      ai: 0,
      aj: 0,
      ak: 0,
      al: 0,
      am: 0,
    }))
  );

  const [target, setTarget] = useState({
    target1: 0,
    target2: 0,
    target3: 0,
    target4: 0,
  });
  const handleInputChange = (dayIndex, field, value) => {
    const newInputs = [...inputs];

    if (value === "") {
      // Reset the field to 0 if the input is empty
      newInputs[dayIndex][field] = "";
    } else {
      // Parse the input value to a float
      const floatValue = parseFloat(value.replace(",", "."));

      if (isNaN(floatValue)) {
        // If the parsed value is not a number, reset the field to 0
        newInputs[dayIndex][field] = 0;
      } else {
        // Set the field to the parsed float value, including negatives and zero
        newInputs[dayIndex][field] = floatValue;
      }
    }

    // Update the inputs state with the new values
    setInputs(newInputs);
  };

  const handleTargetChange = (e) => {
    const { name, value } = e.target;
    const floatValue = parseFloat(value.replace(",", "."));

    if (isNaN(floatValue)) {
      setTarget((prev) => ({ ...prev, [name]: 0 }));
    } else {
      setTarget((prev) => ({ ...prev, [name]: floatValue }));
    }
  };
  const sumofL = inputs.reduce((acc, curr) => acc + Number(curr.l), 0);
  const sumofM = inputs.reduce((acc, curr) => acc + Number(curr.m), 0);
  const sumofP = inputs.reduce((acc, curr) => acc + Number(curr.p), 0);
  const sumofQ = inputs.reduce((acc, curr) => acc + Number(curr.q), 0);
  const totalsaleee = sumofP + sumofQ;
  const sumofW = inputs.reduce((acc, curr) => acc + Number(curr.w), 0);
  const sumofX = inputs.reduce((acc, curr) => acc + Number(curr.x), 0);
  const sumofY = sumofP + sumofQ - sumofX;
  const maybeL = sumofL + sumofM;
  const maybeP = sumofP + sumofQ;
  const pureofL = maybeL > 0 ? (sumofL * 100) / maybeL : 0;
  const pureofM = maybeL > 0 ? (sumofM * 100) / maybeL : 0;
  const pureofP = maybeP > 0 ? (sumofP * 100) / maybeP : 0;
  const pureofQ = maybeP > 0 ? (sumofQ * 100) / maybeP : 0;
  const lossOfW = totalsaleee > 0 ? (sumofW / totalsaleee) * 100 : 0;
  const lossOfX = target.target4 > 0 ? sumofX / target.target4 : 0;
  const lossOfY = target.target4 > 0 ? sumofY / target.target4 : 0;
  const SumofAF = inputs.reduce((acc, curr) => acc + Number(curr.af), 0);
  const SumofAG = inputs.reduce((acc, curr) => acc + Number(curr.ag), 0);
  const SumofAH = inputs.reduce((acc, curr) => acc + Number(curr.ah), 0);
  const SumofAI = SumofAG + SumofAH;
  const SumofAJ = inputs.reduce((acc, curr) => acc + Number(curr.aj), 0);
  const SumofAM = inputs.reduce((acc, curr) => acc + Number(curr.am), 0);
  const totalXY = lossOfX + lossOfY;
  const sumofXY = sumofX + sumofY;
  const sumofvab51 = target.target4 > 0 ? totalsaleee / target.target4 : 0;

  const saveData = async (e) => {
    e.preventDefault();

    const sumofL = inputs.reduce((acc, curr) => acc + Number(curr.l), 0);
    const sumofM = inputs.reduce((acc, curr) => acc + Number(curr.m), 0);
    const sumofP = inputs.reduce((acc, curr) => acc + Number(curr.p), 0);
    const sumofQ = inputs.reduce((acc, curr) => acc + Number(curr.q), 0);
    const totalsaleee = sumofP + sumofQ;
    const sumofW = inputs.reduce((acc, curr) => acc + Number(curr.w), 0);
    const sumofX = inputs.reduce((acc, curr) => acc + Number(curr.x), 0);
    const sumofY = sumofP + sumofQ - sumofX;
    const maybeL = sumofL + sumofM;
    const maybeP = sumofP + sumofQ;
    const pureofL = maybeL > 0 ? (sumofL * 100) / maybeL : 0;
    const pureofM = maybeL > 0 ? (sumofM * 100) / maybeL : 0;
    const pureofP = maybeP > 0 ? (sumofP * 100) / maybeP : 0;
    const pureofQ = maybeP > 0 ? (sumofQ * 100) / maybeP : 0;
    const lossOfW = totalsaleee > 0 ? (sumofW / totalsaleee) * 100 : 0;
    const lossOfX = target.target4 > 0 ? sumofX / target.target4 : 0;
    const lossOfY = target.target4 > 0 ? sumofY / target.target4 : 0;
    const SumofAF = inputs.reduce((acc, curr) => acc + Number(curr.af), 0);
    const SumofAG = inputs.reduce((acc, curr) => acc + Number(curr.ag), 0);
    const SumofAH = inputs.reduce((acc, curr) => acc + Number(curr.ah), 0);
    const SumofAI = SumofAG + SumofAH;
    const SumofAJ = inputs.reduce((acc, curr) => acc + Number(curr.aj), 0);
    const SumofAM = inputs.reduce((acc, curr) => acc + Number(curr.am), 0);
    const totalXY = lossOfX + lossOfY;
    const sumofXY = sumofX + sumofY;
    const sumofvab51 = target.target4 > 0 ? totalsaleee / target.target4 : 0;
    const datee = document.getElementById("datee").value;

    try {
      const data = {
        Department: user?.department,
        UserName: user?.username,
        Date: datee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        j: inputs.map((day) => day.j),
        k: inputs.map((day) => day.k),
        l: inputs.map((day) => day.l),
        m: inputs.map((day) => day.m),
        totalStockTank1: inputs.map((day) => day.j + day.l),
        totalStockTank2: inputs.map((day) => day.k + day.m),
        p: inputs.map((day) => day.p),
        q: inputs.map((day) => day.q),
        closingStockTank1: inputs.map((day) => day.j + day.l - day.p),
        closingStockTank2: inputs.map((day) => day.k + day.m - day.q),
        TotalStockk: inputs.map(
          (day) => day.j + day.l - day.p + (day.k + day.m - day.q)
        ),
        Salee: inputs.map((day) => day.p + day.q),
        w: inputs.map((day) => day.w),
        x: inputs.map((day) => day.x),
        SaleShift2: inputs.map((day) => day.p + day.q - day.x),
        TotalTank12: inputs.map((day) => day.aa + day.ac),
        aa: inputs.map((day) => day.aa),
        Tank1variance: inputs.map((day) => day.aa - (day.k + day.m - day.q)),
        ac: inputs.map((day) => day.ac),
        Tank2variance: inputs.map((day) => day.ac - (day.j + day.l - day.p)),
        BothTankVariance: inputs.map(
          (day) =>
            day.aa - (day.k + day.m - day.q) + day.ac - (day.j + day.l - day.p)
        ),
        af: inputs.map((day) => day.af),
        ag: inputs.map((day) => day.ag),
        ah: inputs.map((day) => day.ah),
        ai: inputs.map((day) => day.ag + day.ah),
        aj: inputs.map((day) => day.aj),
        ak: inputs.map((day) => day.ak),
        al: inputs.map((day) => day.al),
        am: inputs.map((day) => day.am),
        sumofL: sumofL,
        sumofM: sumofM,
        sumofP: sumofP,
        sumofQ: sumofQ,
        totalsaleee: totalsaleee,
        sumofW: sumofW,
        sumofX: sumofX,
        sumofY: sumofY,
        pureofL: pureofL,
        pureofM: pureofM,
        pureofP: pureofP,
        pureofQ: pureofQ,
        lossOfW: lossOfW,
        lossOfX: lossOfX,
        lossOfY: lossOfY,
        SumofAF: SumofAF,
        SumofAG: SumofAG,
        SumofAH: SumofAH,
        SumofAI: SumofAI,
        SumofAJ: SumofAJ,
        SumofAM: SumofAM,
        target1: target.target1,
        target2: target.target2,
        target3: target.target3,
        target4: target.target4,
        totalXY: totalXY,
        sumofXY: sumofXY,
        sumofvab51: sumofvab51,
        maybeL: maybeL,
        maybeP: maybeP,
      };
      const response = await axiosInstance.post(
        "/bank/monthlyfundflow",
        data
      );
      toast.success("Data Succussfully");
    } catch (error) {
      toast.warn("Failed to send data");
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-400 to-yellow-400 flex-col items-center justify-center min-h-screen p-6">
        <form onSubmit={saveData}>
         <div>
         <h1 className="text-center  text-3xl p-4 text-blue-600">
            Monthly Data Flow
          </h1>
          <div className="flex justify-evenly items-center  p-4">
            <Link to={"/bankreport"}>
              <div className="">
                <img src={previousImage} width={50} alt="Back" />
              </div>
            </Link>
            <div className="text-center mt-5 text-xl p-4">
              <input type="date" id="datee" className='bg-transparent'  />
            </div>
            <div>
              <button type="submit">
                <img src={saveImage} width={50} alt="Save" />
              </button>{" "}
            </div>
          </div>
         </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Op. Stock Tank 2</th>
                <th> Op. Stock Tank 1</th>
                <th>Pur. Tank 2</th>
                <th>Pur. Tank 1</th>
                <th>Total Stock Tank 2</th>
                <th>Total Stock Tank 1</th>
                <th>Sales Tank 2</th>
                <th>Sales Tank 1</th>
                <th>Closing Stock Tank 2</th>
                <th>Closing Stock Tank 1</th>
                <th>Total Stock</th>
                <th>Sale</th>
                <th>For the day +/-</th>
                <th>Sale Shift 1</th>
                <th>Sale Shift 2</th>
                <th>Total Tank 1 + Tank 2</th>
                <th>Tank 1 Actual Stock</th>
                <th>Tank 1 Variance</th>
                <th>Tank 2 Actual Stock</th>
                <th>Tank 2 Variance</th>
                <th>Both Tank Variance</th>
                <th>Credit Sale</th>
                <th>Tank 1 Daily Tank wise variance</th>
                <th>Tank 2 Daily Tank wise variance</th>
                <th>Total</th>
                <th>Pur..</th>
                <th>Loss %</th>
                <th>Avg</th>
                <th>Testing</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                const date = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  dayIndex + 1
                );
                return (
                  <tr key={dayIndex}>
                    <td>{date.toLocaleDateString()}</td>
                    <td>
                      <input
                        type="number"
                        id={`j${dayIndex + 1}`}
                        value={inputs[dayIndex].j}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "j", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`k${dayIndex + 1}`}
                        value={inputs[dayIndex].k}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "k", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`l${dayIndex + 1}`}
                        value={inputs[dayIndex].l}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "l", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`m${dayIndex + 1}`}
                        value={inputs[dayIndex].m}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "m", e.target.value)
                        }
                      />
                    </td>
                    <td>{inputs[dayIndex].j + inputs[dayIndex].l}</td>
                    <td>{inputs[dayIndex].k + inputs[dayIndex].m}</td>
                    <td>
                      <input
                        type="number"
                        id={`p${dayIndex + 1}`}
                        value={inputs[dayIndex].p}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "p", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`q${dayIndex + 1}`}
                        value={inputs[dayIndex].q}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "q", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {inputs[dayIndex].j +
                        inputs[dayIndex].l -
                        inputs[dayIndex].p}
                    </td>
                    <td>
                      {inputs[dayIndex].k +
                        inputs[dayIndex].m -
                        inputs[dayIndex].q}
                    </td>

                    <td>
                      {inputs[dayIndex].j +
                        inputs[dayIndex].l -
                        inputs[dayIndex].p +
                        (inputs[dayIndex].k +
                          inputs[dayIndex].m -
                          inputs[dayIndex].q)}
                    </td>
                    <td>{inputs[dayIndex].p + inputs[dayIndex].q}</td>
                    <td>
                      <input
                        type="number"
                        id={`w${dayIndex + 1}`}
                        value={inputs[dayIndex].w}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "w", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`x${dayIndex + 1}`}
                        value={inputs[dayIndex].x}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "x", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {inputs[dayIndex].p +
                        inputs[dayIndex].q -
                        inputs[dayIndex].x}{" "}
                    </td>
                    <td>{inputs[dayIndex].aa + inputs[dayIndex].ac}</td>
                    <td>
                      <input
                        type="number"
                        id={`aa${dayIndex + 1}`}
                        value={inputs[dayIndex].aa}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "aa", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {inputs[dayIndex].aa -
                        (inputs[dayIndex].k +
                          inputs[dayIndex].m -
                          inputs[dayIndex].q)}
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`ac${dayIndex + 1}`}
                        value={inputs[dayIndex].ac}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "ac", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {inputs[dayIndex].ac -
                        (inputs[dayIndex].j +
                          inputs[dayIndex].l -
                          inputs[dayIndex].p)}
                    </td>
                    <td>
                      {inputs[dayIndex].aa -
                        (inputs[dayIndex].k +
                          inputs[dayIndex].m -
                          inputs[dayIndex].q) +
                        (inputs[dayIndex].ac -
                          (inputs[dayIndex].j +
                            inputs[dayIndex].l -
                            inputs[dayIndex].p))}
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`af${dayIndex + 1}`}
                        value={inputs[dayIndex].af}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "af", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`ag${dayIndex + 1}`}
                        value={inputs[dayIndex].ag}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "ag", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`ah${dayIndex + 1}`}
                        value={inputs[dayIndex].ah}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "ah", e.target.value)
                        }
                      />
                    </td>
                    <td>{inputs[dayIndex].ag + inputs[dayIndex].ah}</td>
                    <td>
                      <input
                        type="number"
                        id={`aj${dayIndex + 1}`}
                        value={inputs[dayIndex].aj}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "aj", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`ak${dayIndex + 1}`}
                        value={inputs[dayIndex].ak}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "ak", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`al${dayIndex + 1}`}
                        value={inputs[dayIndex].al}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "al", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        id={`am${dayIndex + 1}`}
                        value={inputs[dayIndex].am}
                        onChange={(e) =>
                          handleInputChange(dayIndex, "am", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>{sumofL}</strong>
                </td>
                <td>
                  <strong>{sumofM}</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>{sumofP}</strong>
                </td>
                <td>
                  <strong>{sumofQ}</strong>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td>{totalsaleee}</td>
                <td>{sumofW}</td>
                <td>{sumofX}</td>
                <td>{sumofY}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <strong>% PUR</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>{pureofL.toFixed(2)}</strong>
                </td>
                <td>
                  <strong>{pureofM.toFixed(2)}</strong>
                </td>
                <td></td>
                <td>
                  <strong> % Sale</strong>
                </td>
                <td>
                  <strong> {pureofP.toFixed(2)}</strong>
                </td>
                <td>
                  <strong> {pureofQ.toFixed(2)}</strong>
                </td>
                <td></td>
                <td></td>
                <td>Act. Loss</td>
                <td>{lossOfW}</td>
                <td>{lossOfX}</td>
                {/* krna h ye dono Y wala bhi */}
                <td>{lossOfY}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{SumofAF}</td>
                <td>{SumofAG}</td>
                <td>{SumofAH}</td>
                <td>{SumofAI}</td>
                <td>{SumofAJ}</td>
                <td></td>
                <td></td>
                <td>{SumofAM}</td>
              </tr>
              <tr>
                <td>
                  <strong>Target</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <input
                    type="number"
                    name="target1"
                    value={target.target1 || 0}
                    onChange={handleTargetChange}
                  />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Water</td>
                <td>
                  {" "}
                  <input
                    type="number"
                    name="target3"
                    value={target.target3 || 0}
                    onChange={handleTargetChange}
                  />
                </td>
                <td></td>
                <td></td>
                <td>{totalXY.toFixed(2)}</td>
                <td></td>
                <td></td>
                <td>
                  <input
                    type="number"
                    name="target4"
                    value={target.target4 || 0}
                    onChange={handleTargetChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Target</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <input
                    type="number"
                    name="target2"
                    value={target.target2 || 0}
                    onChange={handleTargetChange}
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <strong>May be acheived</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>{maybeL}</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>{maybeP}</strong>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{sumofXY}</td>
                <td></td>
                <td>{sumofvab51}</td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default SB03_Monthly;
