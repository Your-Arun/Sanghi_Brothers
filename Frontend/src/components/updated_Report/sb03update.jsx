import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import previousImage from "/previous.png";
import saveImage from "/save.png";
import binImage from "/bin.png";
import { toast } from 'react-toastify'

const Sb03Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [daysInMonth, setDaysInMonth] = useState(31);

  const [updsb3, setUpdsb3] = useState({
    Date: "",
    month: "",
    year: "",
    j: [],
    k: [],
    l: [],
    m: [],
    totalStockTank2: [],
    totalStockTank1: [],
    p: [],
    q: [],
    closingStockTank2: [],
    closingStockTank1: [],
    TotalStockk: [],
    Salee: [],
    w: [],
    x: [],
    SaleShift2: [],
    TotalTank12: [],
    aa: [],
    Tank1variance: [],
    ac: [],
    Tank2variance: [],
    BothTankVariance: [],
    af: [],
    ag: [],
    ah: [],
    ai: [],
    aj: [],
    ak: [],
    al: [],
    am: [],
    sumofL: "",
    sumofM: "",
    sumofP: "",
    sumofQ: "",
    totalsaleee: "",
    sumofW: "",
    sumofX: "",
    sumofY: "",
    pureofL: "",
    pureofM: "",
    pureofP: "",
    pureofQ: "",
    lossOfW: "",
    lossOfX: "",
    lossOfY: "",
    SumofAF: "",
    SumofAG: "",
    SumofAH: "",
    SumofAI: "",
    SumofAJ: "",
    SumofAM: "",
    target1: "",
    target2: "",
    target3: "",
    target4: "",
    totalXY: "",
    sumofXY: "",
    sumofvab51: "",
    maybeL: "",
    maybeP: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axiosInstance.get(
          `/bank/monthlyfundflow/${id}`
        );
        if (resp.data) {
          setUpdsb3(resp.data);
          setUsername(resp.data.UserName);

          // Calculate days in month
          const daysInMonth = new Date(
            resp.data.year,
            resp.data.month,
            0
          ).getDate();
          setDaysInMonth(daysInMonth);
        }
      } catch (error) {
        toast.warning("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const confirmDeleteToast = (onConfirm) => {
    const toastId = "delete-confirm";

    // Agar already open hai, dobara na kholna
    if (!toast.isActive(toastId)) {
      toast(
        ({ closeToast }) => (
          <div className="flex flex-col gap-2">
            <p>Are you sure you want to delete this ?</p>
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
          toastId,
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
        }
      );
    }
  };


  const handleDelete = async (e) => {
    e.preventDefault()
    confirmDeleteToast(async () => {
      try {
        await axiosInstance.delete(`/bank/monthlyfundflow/${id}`);
        toast.success("Report deleted successfully!");
        navigate("/bankreport"); // Redirect to dashboard or another page
      } catch (error) {
        toast.warning("Failed to delete report.");
      }
    })
  }

  const handleInputChange = (field, index, value) => {
    if (value === "") {
      // Reset the field to 0 if the input is empty
      setUpdsb3((prev) => ({
        ...prev,
        [field]: [
          ...prev[field].slice(0, index),
          0,
          ...prev[field].slice(index + 1),
        ],
      }));
    } else {
      // Parse the input value to a float
      const floatValue = parseFloat(value.replace(",", "."));

      if (isNaN(floatValue)) {
        // If the parsed value is not a number, reset the field to 0
        setUpdsb3((prev) => ({
          ...prev,
          [field]: [
            ...prev[field].slice(0, index),
            0,
            ...prev[field].slice(index + 1),
          ],
        }));
      } else {
        // Set the field to the parsed float value, including negatives and zero
        setUpdsb3((prev) => ({
          ...prev,
          [field]: [
            ...prev[field].slice(0, index),
            floatValue,
            ...prev[field].slice(index + 1),
          ],
        }));
      }
    }
  };
  const handleTargetChange = (e) => {
    const { name, value } = e.target;
    setUpdsb3((prev) => ({ ...prev, [name]: Number(value) }));
  };
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

  if (!updsb3) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No report found...</p>
      </div>
    );
  }
  const sumofL = updsb3.l.reduce((acc, curr) => acc + Number(curr), 0);
  const sumofM = updsb3.m.reduce((acc, curr) => acc + Number(curr), 0);
  const sumofP = updsb3.p.reduce((acc, curr) => acc + Number(curr), 0);
  const sumofQ = updsb3.q.reduce((acc, curr) => acc + Number(curr), 0);
  const sumofW = updsb3.w.reduce((acc, curr) => acc + Number(curr), 0);
  const sumofX = updsb3.x.reduce((acc, curr) => acc + Number(curr), 0);
  const sumofY = sumofP + sumofQ - sumofX;
  const maybeL = sumofL + sumofM;
  const maybeP = sumofP + sumofQ;
  const pureofL = maybeL > 0 ? (sumofL * 100) / maybeL : 0;
  const pureofM = maybeL > 0 ? (sumofM * 100) / maybeL : 0;
  const pureofP = maybeP > 0 ? (sumofP * 100) / maybeP : 0;
  const pureofQ = maybeP > 0 ? (sumofQ * 100) / maybeP : 0;
  const lossOfW =
    sumofP + sumofQ > 0 ? (sumofW / (sumofP + sumofQ)) * 100 : 0;
  const SumofAF = updsb3.af.reduce((acc, curr) => acc + Number(curr), 0);
  const SumofAG = updsb3.ag.reduce((acc, curr) => acc + Number(curr), 0);
  const SumofAH = updsb3.ah.reduce((acc, curr) => acc + Number(curr), 0);
  const SumofAI = SumofAG + SumofAH;
  const SumofAJ = updsb3.aj.reduce((acc, curr) => acc + Number(curr), 0);
  const SumofAM = updsb3.am.reduce((acc, curr) => acc + Number(curr), 0);
  const totalXY =
    updsb3.target4 > 0
      ? sumofX / updsb3.target4 + sumofY / updsb3.target4
      : 0;
  const sumofXY = sumofX + sumofY;
  const sumofvab51 =
    updsb3.target4 > 0 ? (sumofP + sumofQ) / updsb3.target4 : 0;

  const handleSaveSB = async (e) => {
    e.preventDefault();

    const sumofL = updsb3.l.reduce((acc, curr) => acc + Number(curr), 0);
    const sumofM = updsb3.m.reduce((acc, curr) => acc + Number(curr), 0);
    const sumofP = updsb3.p.reduce((acc, curr) => acc + Number(curr), 0);
    const sumofQ = updsb3.q.reduce((acc, curr) => acc + Number(curr), 0);
    const sumofW = updsb3.w.reduce((acc, curr) => acc + Number(curr), 0);
    const sumofX = updsb3.x.reduce((acc, curr) => acc + Number(curr), 0);
    const sumofY = sumofP + sumofQ - sumofX;
    const maybeL = sumofL + sumofM;
    const maybeP = sumofP + sumofQ;
    const pureofL = maybeL > 0 ? (sumofL * 100) / maybeL : 0;
    const pureofM = maybeL > 0 ? (sumofM * 100) / maybeL : 0;
    const pureofP = maybeP > 0 ? (sumofP * 100) / maybeP : 0;
    const pureofQ = maybeP > 0 ? (sumofQ * 100) / maybeP : 0;
    const lossOfW =
      sumofP + sumofQ > 0 ? (sumofW / (sumofP + sumofQ)) * 100 : 0;
    const SumofAF = updsb3.af.reduce((acc, curr) => acc + Number(curr), 0);
    const SumofAG = updsb3.ag.reduce((acc, curr) => acc + Number(curr), 0);
    const SumofAH = updsb3.ah.reduce((acc, curr) => acc + Number(curr), 0);
    const SumofAI = SumofAG + SumofAH;
    const SumofAJ = updsb3.aj.reduce((acc, curr) => acc + Number(curr), 0);
    const SumofAM = updsb3.am.reduce((acc, curr) => acc + Number(curr), 0);
    const totalXY =
      updsb3.target4 > 0
        ? sumofX / updsb3.target4 + sumofY / updsb3.target4
        : 0;
    const sumofXY = sumofX + sumofY;
    const sumofvab51 =
      updsb3.target4 > 0 ? (sumofP + sumofQ) / updsb3.target4 : 0;

    try {
      const upddt = {
        ...updsb3,
        j: updsb3.j,
        k: updsb3.k,
        l: updsb3.l,
        m: updsb3.m,
        totalStockTank1: updsb3.j.map((val, index) => val + updsb3.l[index]),
        totalStockTank2: updsb3.k.map((val, index) => val + updsb3.m[index]),
        closingStockTank1: updsb3.j.map(
          (val, index) => val + updsb3.l[index] - updsb3.p[index]
        ),
        closingStockTank2: updsb3.k.map(
          (val, index) => val + updsb3.m[index] - updsb3.q[index]
        ),
        TotalStockk: updsb3.j.map(
          (val, index) =>
            val +
            updsb3.l[index] -
            updsb3.p[index] +
            (updsb3.k[index] + updsb3.m[index] - updsb3.q[index])
        ),
        Salee: updsb3.p.map((val, index) => val + updsb3.q[index]),
        w: updsb3.w,
        x: updsb3.x,
        SaleShift2: updsb3.p.map(
          (val, index) => val + updsb3.q[index] - updsb3.x[index]
        ),
        TotalTank12: updsb3.aa.map((val, index) => val + updsb3.ac[index]),
        aa: updsb3.aa,
        Tank1variance: updsb3.aa.map(
          (val, index) =>
            val - (updsb3.k[index] + updsb3.m[index] - updsb3.q[index])
        ),
        ac: updsb3.ac,
        Tank2variance: updsb3.ac.map(
          (val, index) =>
            val - (updsb3.j[index] + updsb3.l[index] - updsb3.p[index])
        ),
        BothTankVariance: updsb3.aa.map(
          (val, index) =>
            val -
            (updsb3.k[index] + updsb3.m[index] - updsb3.q[index]) +
            updsb3.ac[index] -
            (updsb3.j[index] + updsb3.l[index] - updsb3.p[index])
        ),
        af: updsb3.af,
        ag: updsb3.ag,
        ah: updsb3.ah,
        ai: updsb3.ag.map((val, index) => val + updsb3.ah[index]),
        aj: updsb3.aj,
        ak: updsb3.ak,
        al: updsb3.al,
        am: updsb3.am,
        sumofL: sumofL,
        sumofM: sumofM,
        sumofP: sumofP,
        sumofQ: sumofQ,
        totalsaleee: sumofP + sumofQ,
        sumofW: sumofW,
        sumofX: sumofX,
        sumofY: sumofY,
        pureofL: pureofL,
        pureofM: pureofM,
        pureofP: pureofP,
        pureofQ: pureofQ,
        lossOfW: lossOfW,
        lossOfX: updsb3.lossOfX,
        lossOfY: updsb3.lossOfY,
        SumofAF: SumofAF,
        SumofAG: SumofAG,
        SumofAH: SumofAH,
        SumofAI: SumofAI,
        SumofAJ: SumofAJ,
        SumofAM: SumofAM,
        target1: updsb3.target1,
        target2: updsb3.target2,
        target3: updsb3.target3,
        target4: updsb3.target4,
        totalXY: totalXY,
        sumofXY: sumofXY,
        sumofvab51: sumofvab51,
        maybeL: maybeL,
        maybeP: maybeP,
      };
      const response = await axiosInstance.put(
        `/bank/monthlyfundflow/${id}`,
        upddt
      );
      toast.success("Save Successfully");
      navigate("/bankreport"); // Redirect after saving
    } catch (error) {
      toast.warn("Not Saving");
    }
  };

  return (
    <>
      <div className="flex-col items-center justify-center p-6">
        <form onSubmit={handleSaveSB}>
        <h1 className="text-center  text-4xl font-bold p-4 text-blue-600">
        Monthly Data Flow
          </h1>

          <h2 className="text-center mt-5 text-3xl p-4">
            {new Date(updsb3.Date)
              .toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "/")}
          </h2>
          <div className="flex justify-evenly p-4">
            <Link to={"/dashboard"}>
              <div>
                <img src={previousImage} width={50} alt="Back" />
              </div>
            </Link>
            <div className="cursor-pointer" onClick={handleDelete}>
              <img src={binImage} alt="Bin" width={50} />
            </div>
            <div>
              <button type="submit" className="bg-transparent">
                <img src={saveImage} width={50} alt="Save" />
              </button>
            </div>
          </div>
          <div className="table-container">
            <table className="">
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
                {Array.from({ length: daysInMonth }, (_, index) => (
                  <tr key={index}>
                    <td>{`${index + 1}/${updsb3.month}/${updsb3.year}`}</td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.j[index] || ""}
                        onChange={(e) =>
                          handleInputChange("j", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.k[index] || ""}
                        onChange={(e) =>
                          handleInputChange("k", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.l[index] || ""}
                        onChange={(e) =>
                          handleInputChange("l", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.m[index] || ""}
                        onChange={(e) =>
                          handleInputChange("m", index, e.target.value)
                        }
                      />
                    </td>
                    <td>{updsb3.j[index] + updsb3.l[index]}</td>
                    <td>{updsb3.k[index] + updsb3.m[index]}</td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.p[index] || ""}
                        onChange={(e) =>
                          handleInputChange("p", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.q[index] || ""}
                        onChange={(e) =>
                          handleInputChange("q", index, e.target.value)
                        }
                      />
                    </td>
                    <td>{updsb3.j[index] + updsb3.l[index] - updsb3.p[index]}</td>
                    <td>{updsb3.k[index] + updsb3.m[index] - updsb3.q[index]}</td>
                    <td>
                      {updsb3.j[index] +
                        updsb3.l[index] -
                        updsb3.p[index] +
                        (updsb3.k[index] + updsb3.m[index] - updsb3.q[index])}
                    </td>
                    <td>{updsb3.p[index] + updsb3.q[index]}</td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.w[index] || ""}
                        onChange={(e) =>
                          handleInputChange("w", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.x[index] || ""}
                        onChange={(e) =>
                          handleInputChange("x", index, e.target.value)
                        }
                      />
                    </td>
                    <td>{updsb3.p[index] + updsb3.q[index] - updsb3.x[index]}</td>
                    <td>{updsb3.aa[index] + updsb3.ac[index]}</td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.aa[index] || ""}
                        onChange={(e) =>
                          handleInputChange("aa", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {updsb3.aa[index] -
                        (updsb3.k[index] + updsb3.m[index] - updsb3.q[index])}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.ac[index] || ""}
                        onChange={(e) =>
                          handleInputChange("ac", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {updsb3.ac[index] -
                        (updsb3.j[index] + updsb3.l[index] - updsb3.p[index])}
                    </td>
                    <td>
                      {updsb3.aa[index] -
                        (updsb3.k[index] + updsb3.m[index] - updsb3.q[index]) +
                        (updsb3.ac[index] -
                          (updsb3.j[index] + updsb3.l[index] - updsb3.p[index]))}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.af[index] || ""}
                        onChange={(e) =>
                          handleInputChange("af", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.ag[index] || ""}
                        onChange={(e) =>
                          handleInputChange("ag", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.ah[index] || ""}
                        onChange={(e) =>
                          handleInputChange("ah", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.ai[index] || ""}
                        onChange={(e) =>
                          handleInputChange("ai", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.aj[index] || ""}
                        onChange={(e) =>
                          handleInputChange("aj", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.ak[index] || ""}
                        onChange={(e) =>
                          handleInputChange("ak", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.al[index] || ""}
                        onChange={(e) =>
                          handleInputChange("al", index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={updsb3.am[index] || ""}
                        onChange={(e) =>
                          handleInputChange("am", index, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
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
                  <td>{sumofP + sumofQ}</td>
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
                  <td>{updsb3.target4 > 0 ? sumofX / updsb3.target4 : 0}</td>
                  <td>{updsb3.target4 > 0 ? sumofY / updsb3.target4 : 0}</td>
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
                      value={updsb3.target1 || 0}
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
                      value={updsb3.target3 || 0}
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
                      value={updsb3.target4 || 0}
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
                      value={updsb3.target2 || 0}
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
                  <td>{sumofXY}</td>
                  <td></td>
                  <td>{sumofvab51}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </>
  );
};

export default Sb03Update;
