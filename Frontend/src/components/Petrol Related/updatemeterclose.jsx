import React, { useState, useEffect } from 'react';
import axiosInstance from '../Dashboard/axiosInstance';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaSave, 
  FaTrash, 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaTachometerAlt, 
  FaWallet, 
  FaOilCan 
} from "react-icons/fa";

const UpdateMeterclose = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- STATE ---
    const [data, setData] = useState({});
    const [date, setDate] = useState('');
    const [cashUnknown, setCashUnknown] = useState('');
    const [cashMs, setCashMs] = useState('');
    const [cashSp, setCashSp] = useState('');
    const [crSalesMs, setCrSalesMs] = useState('');
    const [u2, setU2] = useState('');
    const [rate, setRate] = useState('');
    const [ntry1, setNtry1] = useState('');
    const [ntry2, setNtry2] = useState('');
    
    const [items, setItems] = useState([
        'Opening Meter', 'Sales', 'Total', 'Oil', 'Totals', 'Testing', 'Closing Meter',
    ]);
    
    const [inputs, setInputs] = useState({
        points: items.map((item) => ({
            name: item, n1: '', n2: '', n3: '', n4: '', n5: '', n6: '',
        })),
        items1: Array.from({ length: 7 }, () => ({
            sno: '', name: '', qnty: '', amt: '', oilqty: '', oilamt: '', total: '',
        })),
    });

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/meterclose/${id}`);
                const fetchedData = response.data;
                setData(fetchedData);
                // Formatting date for input type="date"
                const formattedDate = fetchedData.date ? new Date(fetchedData.date).toISOString().split('T')[0] : '';
                setDate(formattedDate);
                
                setCashUnknown(fetchedData.cashUnknown);
                setCashMs(fetchedData.cashMs);
                setCashSp(fetchedData.cashSp);
                setCrSalesMs(fetchedData.crSalesMs);
                setU2(fetchedData.u2);
                setRate(fetchedData.rate);
                setInputs(fetchedData);
                setNtry1(fetchedData.entry1);
                setNtry2(fetchedData.entry2)
            } catch (error) {
                toast.warn("Error loading data.");
            }
        };
        fetchData();
    }, [id]);

    // --- HANDLERS ---
    const handleInputChange = (e, index, type) => {
        const { id, value } = e.target;
        if (type === 'points') {
            setInputs((prevInputs) => ({
                ...prevInputs,
                points: prevInputs.points.map(
                    (point, pointIndex) => (pointIndex === index ? { ...point, [id]: value } : point)
                ),
            }));
        } else {
            setInputs((prevInputs) => ({
                ...prevInputs,
                items1: prevInputs.items1.map(
                    (item, itemIndex) => (itemIndex === index ? { ...item, [id]: value } : item)
                ),
            }));
        }
    };

    const handleItemChange = (e, index) => {
        const updatedItems = [...items];
        updatedItems[index] = e.target.value;
        setItems(updatedItems);
        const updatedPoints = [...inputs.points];
        updatedPoints[index].name = e.target.value;
        setInputs({ points: updatedPoints });
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleRateChange = (e) => {
        setRate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const originalData = data;
        const updatedData = {
            date: new Date(date).toISOString().split('T')[0],
            rate,
            ntry1,
            ntry2,
            cashUnknown,
            cashMs,
            cashSp,
            crSalesMs,
            u2,
            points: inputs.points,
            items1: inputs.items1,
            totaln1, totaln2, totaln3, totaln4, totaln5, totaln6,
            totals1, totals2, totals3, totals4, totals5, totals6,
            closingMetern1, closingMetern2, closingMetern3, closingMetern4, closingMetern5, closingMetern6,
        };

        if (JSON.stringify(originalData) !== JSON.stringify(updatedData)) {
            try {
                await axiosInstance.put(`/meterclose/${id}`, updatedData);
                toast.success('Meter Close updated successfully!');
            } catch (error) {
                toast.warning('Error updating Meter Close!');
            }
        } else {
            toast.warning('No changes made. Data saved without changes.');
        }
    };

    const confirmDeleteToast = (onConfirm) => {
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p className="text-gray-800 font-medium">Are you sure you want to delete this?</p>
                    <div className="flex gap-3 mt-2">
                        <button onClick={() => { onConfirm(); closeToast(); }} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Yes</button>
                        <button onClick={closeToast} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">No</button>
                    </div>
                </div>
            ),
            { position: "top-center", autoClose: false, closeOnClick: false, closeButton: false }
        )
    }

    const handleDelete = async () => {
        confirmDeleteToast(async () => {
            try {
                const response = await axiosInstance.delete(`/meterclose/${id}`);
                if (response.status === 200) {
                    toast.success('Deleted successfully!');
                    navigate('/createmeterclose');
                } else {
                    toast.warning('Error deleting!');
                }
            } catch (error) {
                toast.warn('Error deleting!');
            }
        })
    }

    // --- CALCULATIONS ---
    const datee = date.split('T')[0]; // kept for safety, though date state is used
    const openingMeterIndex = items.indexOf('Opening Meter');
    const salesIndex = items.indexOf('Sales');
    const oilIndex = items.indexOf('Oil');
    const testingIndex = items.indexOf('Testing');
    
    // Safety checks
    const openingMeterValues = inputs.points[openingMeterIndex] || {};
    const salesValues = inputs.points[salesIndex] || {};
    const oilValues = inputs.points[oilIndex] || {};
    const testingValues = inputs.points[testingIndex] || {};

    const nozzleValues = {
        n1: salesValues.n1 || 0, n2: salesValues.n2 || 0, n3: salesValues.n3 || 0,
        n4: salesValues.n4 || 0, n5: salesValues.n5 || 0, n6: salesValues.n6 || 0
    };
    const totalOpeningMeter = {
        n1: openingMeterValues.n1 || 0, n2: openingMeterValues.n2 || 0, n3: openingMeterValues.n3 || 0,
        n4: openingMeterValues.n4 || 0, n5: openingMeterValues.n5 || 0, n6: openingMeterValues.n6 || 0
    };

    const totaln1 = parseInt(totalOpeningMeter.n1) + parseInt(nozzleValues.n1) || 0;
    const totaln2 = parseInt(totalOpeningMeter.n2) + parseInt(nozzleValues.n2) || 0;
    const totaln3 = parseInt(totalOpeningMeter.n3) + parseInt(nozzleValues.n3) || 0;
    const totaln4 = parseInt(totalOpeningMeter.n4) + parseInt(nozzleValues.n4) || 0;
    const totaln5 = parseInt(totalOpeningMeter.n5) + parseInt(nozzleValues.n5) || 0;
    const totaln6 = parseInt(totalOpeningMeter.n6) + parseInt(nozzleValues.n6) || 0;

    const oilValuesCalculated = {
        n1: oilValues.n1 || 0, n2: oilValues.n2 || 0, n3: oilValues.n3 || 0,
        n4: oilValues.n4 || 0, n5: oilValues.n5 || 0, n6: oilValues.n6 || 0
    };

    const totals1 = parseInt(totaln1) + parseInt(oilValuesCalculated.n1) || 0;
    const totals2 = parseInt(totaln2) + parseInt(oilValuesCalculated.n2) || 0;
    const totals3 = parseInt(totaln3) + parseInt(oilValuesCalculated.n3) || 0;
    const totals4 = parseInt(totaln4) + parseInt(oilValuesCalculated.n4) || 0;
    const totals5 = parseInt(totaln5) + parseInt(oilValuesCalculated.n5) || 0;
    const totals6 = parseInt(totaln6) + parseInt(oilValuesCalculated.n6) || 0;

    const closingMetern1 = parseInt(oilValuesCalculated.n1) + parseInt(totaln1) + parseInt(testingValues.n1 || 0) || 0;
    const closingMetern2 = parseInt(oilValuesCalculated.n2) + parseInt(totaln2) + parseInt(testingValues.n2 || 0) || 0;
    const closingMetern3 = parseInt(oilValuesCalculated.n3) + parseInt(totaln3) + parseInt(testingValues.n3 || 0) || 0;
    const closingMetern4 = parseInt(oilValuesCalculated.n4) + parseInt(totaln4) + parseInt(testingValues.n4 || 0) || 0;
    const closingMetern5 = parseInt(oilValuesCalculated.n5) + parseInt(totaln5) + parseInt(testingValues.n5 || 0) || 0;
    const closingMetern6 = parseInt(oilValuesCalculated.n6) + parseInt(totaln6) + parseInt(testingValues.n6 || 0) || 0;

    const totalCredit = parseInt(cashUnknown || 0) + parseInt(cashMs || 0) + parseInt(cashSp || 0) + parseInt(crSalesMs || 0) + parseInt(u2 || 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
            <form onSubmit={handleSubmit}>
                
                {/* --- HEADER --- */}
                <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <Link to={'/createmeterclose'} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition">
                            <FaArrowLeft />
                         </Link>
                         <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Update Meter Close</h1>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            type="button" 
                            onClick={handleDelete}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete Report"
                        >
                            <FaTrash />
                        </button>
                        <button 
                            type="submit" 
                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
                        >
                            <FaSave /> <span className="hidden sm:inline">Update</span>
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                    {/* --- CARD 1: General Info --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={handleDateChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Petrol Rate</label>
                                <div className="relative">
                                    <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        value={rate}
                                        onChange={handleRateChange}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CARD 2: Meter Readings --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                            <FaTachometerAlt className="text-blue-500" />
                            <h2 className="text-lg font-bold text-gray-800">Meter Readings</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[150px]">Description</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">Nozzle 1</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">Nozzle 2</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">Nozzle 3</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">Nozzle 4</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">Nozzle 5</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">Nozzle 6</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {inputs.points.map((point, index) => {
                                        const isCalculated = index === 2 || index === 4 || index === 6;
                                        const calculatedValues = 
                                            index === 2 ? [totaln1, totaln2, totaln3, totaln4, totaln5, totaln6] :
                                            index === 4 ? [totals1, totals2, totals3, totals4, totals5, totals6] :
                                            index === 6 ? [closingMetern1, closingMetern2, closingMetern3, closingMetern4, closingMetern5, closingMetern6] : [];

                                        return (
                                            <tr key={index} className={`${isCalculated ? 'bg-blue-50' : 'bg-white'}`}>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={point.name}
                                                        onChange={(e) => handleItemChange(e, index)}
                                                        className={`w-full bg-transparent font-bold text-sm focus:outline-none ${isCalculated ? 'text-blue-800' : 'text-gray-700'}`}
                                                    />
                                                </td>
                                                {isCalculated ? (
                                                    calculatedValues.map((val, i) => (
                                                        <td key={i} className="px-4 py-2 text-center text-sm font-bold text-blue-700">{val}</td>
                                                    ))
                                                ) : (
                                                    ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'].map((field) => (
                                                        <td key={field} className="px-2 py-2">
                                                            <input
                                                                type="number"
                                                                id={field}
                                                                value={point[field]}
                                                                onChange={(e) => handleInputChange(e, index, 'points')}
                                                                className="w-full text-center p-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                            />
                                                        </td>
                                                    ))
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- CARD 3: Cash & Credit --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                            <FaWallet className="text-green-600" />
                            <h2 className="text-lg font-bold text-gray-800">Cash & Credit Sales</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            
                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <input type="text" value={ntry1} onChange={(e)=>setNtry1(e.target.value)} placeholder="Entry 1 Label" className="w-full sm:w-1/3 p-2 text-sm border border-gray-300 rounded bg-gray-50" />
                                <input type="number" value={cashUnknown} onChange={(e)=>setCashUnknown(e.target.value)} placeholder="0.00" className="w-full sm:w-2/3 p-2 text-sm border border-gray-300 rounded focus:ring-blue-500" />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <label className="w-full sm:w-1/3 text-sm font-bold text-gray-600">Cash MS</label>
                                <input type="number" value={cashMs} onChange={(e)=>setCashMs(e.target.value)} className="w-full sm:w-2/3 p-2 text-sm border border-gray-300 rounded focus:ring-blue-500" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <label className="w-full sm:w-1/3 text-sm font-bold text-gray-600">Cash SP</label>
                                <input type="number" value={cashSp} onChange={(e)=>setCashSp(e.target.value)} className="w-full sm:w-2/3 p-2 text-sm border border-gray-300 rounded focus:ring-blue-500" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <label className="w-full sm:w-1/3 text-sm font-bold text-gray-600">CR. Sale M.S</label>
                                <input type="number" value={crSalesMs} onChange={(e)=>setCrSalesMs(e.target.value)} className="w-full sm:w-2/3 p-2 text-sm border border-gray-300 rounded focus:ring-blue-500" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <input type="text" value={ntry2} onChange={(e)=>setNtry2(e.target.value)} placeholder="Entry 2 Label" className="w-full sm:w-1/3 p-2 text-sm border border-gray-300 rounded bg-gray-50" />
                                <input type="number" value={u2} onChange={(e)=>setU2(e.target.value)} placeholder="0.00" className="w-full sm:w-2/3 p-2 text-sm border border-gray-300 rounded focus:ring-blue-500" />
                            </div>

                             <div className="md:col-span-2 mt-4 bg-green-50 p-4 rounded-lg flex justify-between items-center border border-green-100">
                                <span className="text-lg font-bold text-green-800">Total Credit</span>
                                <span className="text-xl font-bold text-green-700">₹{totalCredit}</span>
                             </div>

                        </div>
                    </div>

                    {/* --- CARD 4: Oil/Product Sales --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                            <FaOilCan className="text-orange-500" />
                            <h2 className="text-lg font-bold text-gray-800">Lubricant & Product Sales</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">Product Name</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Amt</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Oil Qty</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Oil Amt</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {inputs.items1.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">
                                                <input type="number" value={item.sno} onChange={(e) => handleInputChange(e, index, 'items1')} id="sno" placeholder={index + 1} className="w-10 text-center text-sm border border-gray-300 rounded p-1" />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="text" value={item.name} onChange={(e) => handleInputChange(e, index, 'items1')} id="name" className="w-full text-sm border border-gray-300 rounded p-1.5 focus:border-blue-500 outline-none" placeholder="Item Name"/>
                                            </td>
                                            <td className="px-2 py-2">
                                                <input type="number" id="qnty" value={item.qnty} 
                                                    onChange={(e) => {
                                                        const qnty = e.target.value || 0;
                                                        const amt = qnty * rate;
                                                        handleInputChange(e, index, 'items1');
                                                        setInputs((prev) => ({...prev, items1: prev.items1.map((itm, i) => i === index ? { ...itm, amt: amt.toFixed(2) } : itm)}));
                                                    }}
                                                    className="w-20 text-center text-sm border border-gray-300 rounded p-1" 
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input type="number" id="amt" value={item.amt} readOnly className="w-20 text-center text-sm bg-gray-100 border border-gray-300 rounded p-1 text-gray-600" />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input type="number" id="oilqty" value={item.oilqty} onChange={(e) => handleInputChange(e, index, 'items1')} className="w-20 text-center text-sm border border-gray-300 rounded p-1" />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input type="number" id="oilamt" value={item.oilamt} 
                                                    onChange={(e) => {
                                                        const oilamt = e.target.value || 0;
                                                        const amt = inputs.items1[index].amt || 0;
                                                        const total = parseFloat(amt) + parseFloat(oilamt);
                                                        handleInputChange(e, index, 'items1');
                                                        setInputs((prev) => ({...prev, items1: prev.items1.map((itm, i) => i === index ? { ...itm, total: total.toFixed(2) } : itm)}));
                                                    }}
                                                    className="w-20 text-center text-sm border border-gray-300 rounded p-1"
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input type="number" id="total" value={item.total} readOnly className="w-24 text-center text-sm bg-blue-50 border border-blue-200 rounded p-1 font-bold text-blue-700" />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-100 font-bold">
                                        <td colSpan={2} className="px-4 py-2 text-right text-sm text-gray-700">TOTAL:</td>
                                        <td className="px-2 py-2 text-center text-sm">{inputs.items1.reduce((acc, item) => acc + (parseFloat(item.qnty) || 0), 0).toFixed(2)}</td>
                                        <td className="px-2 py-2 text-center text-sm">{inputs.items1.reduce((acc, item) => acc + (parseFloat(item.amt) || 0), 0).toFixed(2)}</td>
                                        <td className="px-2 py-2 text-center text-sm">{inputs.items1.reduce((acc, item) => acc + (parseFloat(item.oilqty) || 0), 0).toFixed(2)}</td>
                                        <td className="px-2 py-2 text-center text-sm">{inputs.items1.reduce((acc, item) => acc + (parseFloat(item.oilamt) || 0), 0).toFixed(2)}</td>
                                        <td className="px-2 py-2 text-center text-sm text-blue-700">{inputs.items1.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default UpdateMeterclose;