import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance';
import UserContext from "../Home Page/UserContext";
import { toast } from 'react-toastify';
import { 
  FaSave, 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaGasPump, 
  FaRupeeSign, 
  FaLayerGroup,
  FaClock
} from "react-icons/fa";

const Lekhajokha = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    
    // --- STATE ---
    const [date, setDate] = useState('');
    const [rate, setRate] = useState('');
    const [sale, setSale] = useState('');
    const [paytm, setPaytm] = useState('');
    const [selectedShift, setSelectedShift] = useState('');
    
    const [nozzleReadings, setNozzleReadings] = useState([
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
    ]);

    const [item, setItem] = useState([
        '1 Ltr 2T oil Bottle', '250 ml 2T oil Bottle', '60 ml 2T oil Pouch',
        '40 ml 2T oil Pouch', '20 ml 2T oil Pouch', '1 Ltr NXT oil Bottle',
        '900 NXT oil Bottle', '1 Ltr 4T Plus oil bottle', '900 ml 4T plus oil bottle',
        '900 ml scootech oil bottle', '1 Ltr Redi-cool', '500ml Redi-cool',
        '', '', '',
    ]);

    const [inputs, setInputs] = useState({
        points: item.map((itm) => ({
            sno: "",
            name: itm,
            opening: "",
            sale: "",
            leakage: "",
            add: "",
            closing: "",
        })),
    });

    // --- HANDLERS ---
    const handleInputChnge = (e, index) => {
        const { id, value } = e.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            points: prevInputs.points.map((point, pointIndex) =>
                pointIndex === index ? { ...point, [id]: value } : point
            ),
        }));
    };

    const handleItemChange = (e, index) => {
        const newValue = e.target.value;
        
        // Update item array
        const updatedItems = [...item];
        updatedItems[index] = newValue;
        setItem(updatedItems);
        
        // Update points array to stay in sync
        const updatedPoints = [...inputs.points];
        updatedPoints[index].name = newValue;
        setInputs({ points: updatedPoints });
    };

    const handleNozzleReadingChange = (e, index) => {
        const { id, value } = e.target;
        setNozzleReadings((prevNozzleReadings) => {
            const updatedNozzleReadings = [...prevNozzleReadings];
            updatedNozzleReadings[index][id] = value;
            return updatedNozzleReadings;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!date || !selectedShift) {
            toast.warn("Please select Date and Shift.");
            return;
        }

        const data = {
            username: user?.username,
            department: user?.department,
            date: new Date(date).toISOString().split('T')[0],
            rate: rate,
            sale: sale,
            paytm: paytm,
            shift: selectedShift,
            points: inputs.points.map((point, i) => ({
                ...point,
                name: item[i], // Ensure name comes from the item array state
            })),
            nozzleReadings: nozzleReadings,
        };

        try {
            await axiosInstance.post("/newlekhajokha", data);
            toast.success("Lekha Jokha saved successfully!");
            navigate(-1); // Optional: Go back after save
        } catch (error) {
            toast.error("Error saving Lekha Jokha!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10 font-sans">
            <form onSubmit={handleSubmit}>
                
                {/* --- Sticky Header --- */}
                <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Lekha Jokha</h1>
                    </div>
                    <button 
                        type="submit" 
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg active:scale-95"
                    >
                        <FaSave /> <span className="hidden sm:inline">Save Report</span>
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                    {/* --- Section 1: General Info --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaLayerGroup className="text-blue-500"/> General Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Shift */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Shift</label>
                                <div className="relative">
                                    <FaClock className="absolute left-3 top-3 text-gray-400" />
                                    <select
                                        value={selectedShift}
                                        onChange={(e) => setSelectedShift(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                    >
                                        <option value="">Select Shift</option>
                                        <option value="Morning">Morning</option>
                                        <option value="Evening">Evening</option>
                                    </select>
                                </div>
                            </div>

                            {/* Petrol Rate */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Petrol Rate</label>
                                <div className="relative">
                                    <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Sales Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Total Sale Amount</label>
                                <div className="relative">
                                    <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        value={sale}
                                        onChange={(e) => setSale(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                             {/* Paytm Amount */}
                             <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Paytm Amount</label>
                                <div className="relative">
                                    <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        value={paytm}
                                        onChange={(e) => setPaytm(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Section 2: Oil / Product Stock --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaLayerGroup className="text-green-500"/> Stock Report
                        </h2>
                        
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-10">#</th>
                                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]">Product Name</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Opening</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Sale</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Leakage</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Add</th>
                                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Closing</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {inputs.points.map((point, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition">
                                            <td className="px-3 py-2 text-sm text-gray-500 text-center">{index + 1}</td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="text"
                                                    value={point.name}
                                                    onChange={(e) => handleItemChange(e, index)}
                                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="Item Name"
                                                />
                                            </td>
                                            {["opening", "sale", "leakage", "add", "closing"].map((field) => (
                                                <td key={field} className="px-2 py-2">
                                                    <input
                                                        type="number"
                                                        id={field}
                                                        value={point[field]}
                                                        onChange={(e) => handleInputChnge(e, index)}
                                                        className="w-24 mx-auto block p-2 text-sm text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- Section 3: Nozzle Readings --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaGasPump className="text-red-500"/> Nozzle Readings
                        </h2>
                        
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nozzle ID</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Reading</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Testing (Ltr)</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Pending (Ltr)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {nozzleReadings.map((reading, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-700">Nozzle {index + 1}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    id="reading"
                                                    value={reading.reading}
                                                    onChange={(e) => handleNozzleReadingChange(e, index)}
                                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    id="testing"
                                                    value={reading.testing}
                                                    onChange={(e) => handleNozzleReadingChange(e, index)}
                                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="text"
                                                    id="pending"
                                                    value={reading.pending}
                                                    onChange={(e) => handleNozzleReadingChange(e, index)}
                                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default Lekhajokha;