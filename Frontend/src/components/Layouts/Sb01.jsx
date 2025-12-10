import React, { useState, useContext } from "react";
import axiosInstance from '../Dashboard/axiosInstance';
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../Home Page/UserContext";
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaSave, 
  FaUniversity, 
  FaMoneyBillWave, 
  FaFileInvoiceDollar, 
  FaGasPump,
  FaCalculator
} from "react-icons/fa";

const Sb01 = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // --- STATE (Kept exactly as is to preserve logic) ---
  const [inputs, setInputs] = useState({
    c6: 0, c7: 0, c8: 0, c9: 0, c10: 0, c11: 0, c12: 0, c13: 0, c14: 0, c15: 0, c16: 0, c17: 0, c20:0,
    d6: 0, d7: 0, d8: 0, d9: 0, d10: 0, d11: 0, d12: 0, d13: 0, d14: 0, d15: 0, d16: 0, d17: 0,
    e6: 0, e7: 0, e8: 0, e9: 0, e10: 0, e11: 0, e12: 0, e13: 0, e14: 0, e15: 0, e16: 0, e17: 0,
    j10: 0, j11: 0,
    f6: 0, f7: 0, f8: 0, f9: 0, f10: 0, f11: 0, f12: 0, f13: 0, f14: 0, f15: 0, f16: 0, f17: 0,
    i6: 0, i7: 0, i8: 0, i9: 0, i10: 0, i11: 0, i12: 0, i13: 0, i14: 0, i15: 0, i16: 0, i17: 0,
    c21: 0, c22: 0, c23: 0, c24: 0, c25: 0, c26: 0, c27: 0, c28: 0, c29: 0, c30: 0, c31: 0, c32: 0, c33: 0, c34: 0, c35: 0, c37: 0, c36: 0, c38: 0, c39: 0,
    e24: 0, e25: 0, e26: 0, e27: 0,
    j13: 0, j14: 0, a32: 0, a33: 0, d32: 0,
    date1:'', date2:'', date3:'', date4:'', date5:'', date6:'', date7:'', date8:'', date9:'',
  });

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    setInputs({
      ...inputs,
      [id]: type === "number" ? (value === "" ? 0 : parseFloat(value) || 0) : value,
    });
  };

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    setInputs({ ...inputs, [id]: value || "" });
  };

  // --- CALCULATIONS (Preserved Logic) ---
  const totalsum = inputs.c6 + inputs.c7 + inputs.c8 + inputs.c9 + inputs.c10 + inputs.c11 + inputs.c12 + inputs.c13 + inputs.c14 + inputs.c15 + inputs.c16 + inputs.c17;
  const j6result = +inputs.c6 - inputs.d6 - inputs.c27 - inputs.c26 - inputs.c25 - inputs.c24 + inputs.c13 + inputs.c14 + inputs.e16;
  const j7result = +inputs.c7 + inputs.d6 + inputs.e17 - inputs.c21 - inputs.c22 - inputs.c23 + inputs.c11;
  const j8result = +inputs.c8 - inputs.d8;
  const j9result = +inputs.c9 - inputs.d9;
  const j12result = j6result + j7result + j8result + j9result + inputs.j10 + inputs.j11;
  const e16result = +inputs.c16;
  const balenv = +totalsum - inputs.c21 - inputs.c22 - inputs.c23 - inputs.c25 - inputs.c27 - inputs.c26 - inputs.c24;
  const c34result = inputs.c32 + inputs.c33 + balenv - inputs.c17 - inputs.c11 + inputs.c30;
  const workingcap = +c34result - inputs.c35 - inputs.c36 - inputs.c37 - inputs.c38 - inputs.c39;
  const e39result = +inputs.c35 + inputs.c36 + inputs.c37 + inputs.c38 + inputs.c39;

  // --- SAVE ---
  const handleSave = async (e) => {
    e.preventDefault();
    const saveData = {
      username: user?.username,
      Department: user?.department,
      Balance_Evening: balenv,
      Total_Fund_Stock: c34result,
      Working_Cappital: workingcap,
      CalculatedValue: { totalsum, j6result, j7result, j8result, j9result, j12result, e16result, balenv, c34result, workingcap, e39result },
      inputs: { ...inputs },
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
      toast.warn("Not Saved Successfully");
    }
  };

  // Helper for Input Cells
  const NumInput = ({ id, val, onChange, placeholder = "0" }) => (
    <input
      type="number"
      id={id}
      value={val === 0 ? "" : val}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full min-w-[80px] p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition text-right"
    />
  );

  const ReadOnlyCell = ({ val }) => (
    <div className="w-full min-w-[80px] p-2 text-sm bg-gray-100 border border-gray-200 rounded font-bold text-gray-700 text-right">
      {typeof val === 'number' ? val.toFixed(2) : val}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <form onSubmit={handleSave}>
        
        {/* --- STICKY HEADER --- */}
        <div className="sticky top-0 z-30 bg-white shadow-md border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button type="button" onClick={() => navigate("/sbbank")} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition">
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaUniversity className="text-red-600" /> Fund Position
              </h1>
              <p className="text-xs text-gray-500">Sanghi Brothers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                <span className="text-xs font-bold text-gray-500">AS ON:</span>
                <input type="date" id="date9" value={inputs.date9} onChange={handleDateChange} className="bg-transparent text-sm font-semibold outline-none text-gray-700 cursor-pointer" />
            </div>
            <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
              <FaSave /> Save
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* --- SECTION 1: BANK ACCOUNTS TABLE --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaUniversity className="text-blue-500"/> Bank Accounts Position
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left w-48">Bank Name</th>
                            <th className="px-4 py-3 text-center" colSpan="2">Transfer</th>
                            <th className="px-4 py-3 text-center" colSpan="2">To A/c No.</th>
                            <th className="px-4 py-3 text-center">Accounts</th>
                            <th className="px-4 py-3 text-center w-32 bg-blue-50 text-blue-700">Closing Bal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[
                            { name: "SBI xxxx06421", c: "c6", d: "d6", e: "e6", f: "f6", i: "i6", res: j6result },
                            { name: "SBIN000068037", c: "c7", d: "d7", e: "e7", f: "f7", i: "i7", res: j7result },
                            { name: "SBI xxxxx5358", c: "c8", d: "d8", e: "e8", f: "f8", i: "i8", res: j8result },
                        ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2 font-semibold text-gray-700">{row.name}</td>
                                <td className="px-2 py-2"><NumInput id={row.c} val={inputs[row.c]} onChange={handleInputChange}/></td>
                                <td className="px-2 py-2"><NumInput id={row.d} val={inputs[row.d]} onChange={handleInputChange}/></td>
                                <td className="px-2 py-2"><NumInput id={row.e} val={inputs[row.e]} onChange={handleInputChange}/></td>
                                <td className="px-2 py-2"><NumInput id={row.f} val={inputs[row.f]} onChange={handleInputChange}/></td>
                                <td className="px-2 py-2"><NumInput id={row.i} val={inputs[row.i]} onChange={handleInputChange}/></td>
                                <td className="px-4 py-2 bg-blue-50/50"><ReadOnlyCell val={row.res}/></td>
                            </tr>
                        ))}
                        {/* Special Row for j9result */}
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-semibold text-gray-400">Other / Adjustment</td>
                            <td className="px-2 py-2"><NumInput id="c9" val={inputs.c9} onChange={handleInputChange}/></td>
                            <td className="px-2 py-2"><NumInput id="d9" val={inputs.d9} onChange={handleInputChange}/></td>
                            <td colSpan={3}></td>
                            <td className="px-4 py-2 bg-blue-50/50"><ReadOnlyCell val={j9result}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>

          {/* --- SECTION 2: DAILY CASH FLOW --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-500"/> Daily Cash Flow
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                    <tbody className="divide-y divide-gray-100">
                        {/* Headers embedded for context */}
                        <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                            <td className="px-4 py-2">Description</td>
                            <td className="px-2 py-2 text-center">Col C</td>
                            <td className="px-2 py-2 text-center">Col D</td>
                            <td className="px-2 py-2 text-center">Col E</td>
                            <td className="px-2 py-2 text-center">Col F</td>
                            <td className="px-2 py-2 text-center">Col I</td>
                            <td className="px-2 py-2 text-center">Col J</td>
                        </tr>
                        {[
                            { name: "Card Pmt not cr. by Paytm/ICICI", c:"c10", d:"d10", e:"e10", f:"f10", i:"i10", j:"j10" },
                            { name: "Cash Deposit from Eve Shift", c:"c11", d:"d11", e:"e11", f:"f11", i:"i11", j:"j11" },
                            { name: "Cash in Hand (Yesterday)", c:"c12", d:"d12", e:"e12", f:"f12", i:"i12", j:"j12", res: j12result },
                            { name: "Recd. from S.V", c:"c13", d:"d13", e:"e13", f:"f13", i:"i13", j:"j13" },
                            { name: "Recd. from Mukund Sanghi", c:"c14", d:"d14", e:"e14", f:"f14", i:"i14", j:"j14" },
                        ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2 font-medium text-gray-700 w-64">{row.name}</td>
                                <td className="px-2 py-2"><NumInput id={row.c} val={inputs[row.c]} onChange={handleInputChange}/></td>
                                <td className="px-2 py-2"><NumInput id={row.d} val={inputs[row.d]} onChange={handleInputChange}/></td>
                                <td className="px-2 py-2"><NumInput id={row.e} val={inputs[row.e]} onChange={handleInputChange}/></td>
                                <td className="px-2 py-2"><NumInput id={row.f} val={inputs[row.f]} onChange={handleInputChange}/></td>
                                <td className="px-2 py-2"><NumInput id={row.i} val={inputs[row.i]} onChange={handleInputChange}/></td>
                                <td className="px-2 py-2">
                                    {row.res !== undefined ? <ReadOnlyCell val={row.res}/> : <NumInput id={row.j} val={inputs[row.j]} onChange={handleInputChange}/>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Split Rows */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 border-t border-gray-200">
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">Other Deposits</h4>
                    <div className="flex gap-2 items-center">
                        <span className="text-sm w-32">Other Deposits</span>
                        <NumInput id="c15" val={inputs.c15} onChange={handleInputChange}/>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-sm w-32">Yest. Cash Dep.</span>
                        <NumInput id="c16" val={inputs.c16} onChange={handleInputChange}/>
                        <span className="text-xs font-bold px-2">Calc:</span>
                        <ReadOnlyCell val={e16result}/>
                        <NumInput id="f16" val={inputs.f16} onChange={handleInputChange}/>
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">Shift Deposits</h4>
                    <div className="flex gap-2 items-center">
                        <span className="text-sm w-32">Today 1st Shift</span>
                        <NumInput id="c17" val={inputs.c17} onChange={handleInputChange}/>
                        <NumInput id="e17" val={inputs.e17} onChange={handleInputChange}/>
                        <NumInput id="f17" val={inputs.f17} onChange={handleInputChange}/>
                    </div>
                    <div className="flex justify-between items-center bg-blue-100 p-2 rounded">
                        <span className="font-bold text-blue-800">Total Sum:</span>
                        <span className="font-bold text-blue-900 text-lg">{totalsum.toFixed(2)}</span>
                    </div>
                </div>
            </div>
          </div>

          {/* --- SECTION 3: PAYMENTS & EXPENSES --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: BPCL Payments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FaFileInvoiceDollar className="text-orange-500"/> BPCL Payments</h2>
                <div className="space-y-3">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="flex items-center gap-2">
                            <span className="text-sm w-20">Invoice {n}</span>
                            <input type="date" id={`date${n}`} value={inputs[`date${n}`]} onChange={handleDateChange} className="p-1.5 border rounded text-xs w-32"/>
                            <NumInput id={`c2${n}`} val={inputs[`c2${n}`]} onChange={handleInputChange}/>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Expenses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FaMoneyBillWave className="text-red-500"/> Expenses</h2>
                <div className="space-y-2">
                    {[
                        { l: "Hearing Healthcare", c: "c24", e: "e24" },
                        { l: "A.K. Sanghi", c: "c25", e: "e25" },
                        { l: "GST of PP", c: "c26", e: "e26" },
                        { l: "Air Compressor", c: "c27", e: "e27" },
                    ].map((row, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <span className="text-sm w-36 truncate">{row.l}</span>
                            <NumInput id={row.c} val={inputs[row.c]} onChange={handleInputChange}/>
                            <NumInput id={row.e} val={inputs[row.e]} onChange={handleInputChange}/>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 bg-red-50 rounded flex justify-between items-center border border-red-100">
                    <span className="font-bold text-red-800">Balance in Evening</span>
                    <span className="font-bold text-xl text-red-900">{balenv.toFixed(2)}</span>
                </div>
            </div>
          </div>

          {/* --- SECTION 4: STOCK & VALUATION --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FaGasPump className="text-purple-600"/> Stock & Valuation</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex gap-2 items-center">
                        <span className="text-sm font-medium w-32">Petrol Stock</span>
                        <NumInput id="a32" val={inputs.a32} onChange={handleInputChange} placeholder="Qty"/>
                        <NumInput id="c32" val={inputs.c32} onChange={handleInputChange} placeholder="Value"/>
                        <NumInput id="d32" val={inputs.d32} onChange={handleInputChange} placeholder="Rate"/>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-sm font-medium w-32">Petrol Purchase</span>
                        <NumInput id="a33" val={inputs.a33} onChange={handleInputChange} placeholder="Qty"/>
                        <NumInput id="c33" val={inputs.c33} onChange={handleInputChange} placeholder="Value"/>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-sm font-medium w-32">Adjustment (C30)</span>
                        <NumInput id="c30" val={inputs.c30} onChange={handleInputChange}/>
                    </div>
                    <div className="p-3 bg-purple-100 rounded border border-purple-200">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-purple-800">Total Fund (Inc. Stock)</span>
                            <span className="font-bold text-xl text-purple-900">{c34result.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Due Payments (BPCL)</h4>
                    {[
                        { l: "Invoice 1", d: "date4", c: "c35" },
                        { l: "Invoice 2", d: "date5", c: "c36" },
                        { l: "Invoice 3", d: "date6", c: "c37" },
                        { l: "Invoice 4", d: "date7", c: "c38" },
                        { l: "Oil Invoice", d: "date8", c: "c39" },
                    ].map((row, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <span className="text-sm w-24">{row.l}</span>
                            <input type="date" id={row.d} value={inputs[row.d]} onChange={handleDateChange} className="p-1.5 border rounded text-xs w-32"/>
                            <NumInput id={row.c} val={inputs[row.c]} onChange={handleInputChange}/>
                        </div>
                    ))}
                    
                    <div className="mt-2 flex justify-end text-xs text-gray-500 font-bold">
                        Total Due: {e39result.toFixed(2)}
                    </div>
                </div>
             </div>

             <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="bg-green-100 p-4 rounded-xl text-center border border-green-200 shadow-sm">
                    <h3 className="text-sm font-bold text-green-700 uppercase tracking-widest mb-1 flex justify-center items-center gap-2">
                        <FaCalculator /> Final Working Capital
                    </h3>
                    <p className="text-3xl font-extrabold text-green-800">₹ {workingcap.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
             </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default Sb01;