import React, { useEffect, useState } from "react";
import axiosInstance from '../Dashboard/axiosInstance';
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaSave, 
  FaTrash, 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaLayerGroup, 
  FaGasPump,
  FaClock,
  FaWallet,
  FaChartLine
} from "react-icons/fa";

const UpdateSaleManagement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- STATE ---
    const [loading, setLoading] = useState(true);
    const [rate, setRate] = useState('');
    const [paytm, setPaytm] = useState('');
    const [sale, setSale] = useState('');
    const [shift, setShift] = useState('');
    const [purchaseManagement, setPurchaseManagement] = useState({
        date: "",
        username: "",
        points: [],
    });
    const [date, setDate] = useState("");
    const [nozzleReadings, setNozzleReadings] = useState([
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
    ]);

    // --- EFFECT ---
    useEffect(() => {
        const fetchPumpSheetData = async () => {
            try {
                const response = await axiosInstance.get(`/newlekhajokha/${id}`);
                setPurchaseManagement(response.data);
                setDate(response.data.date);
                setRate(response.data.rate);
                setPaytm(response.data.paytm);
                setSale(response.data.sale);
                setShift(response.data.shift);
                setNozzleReadings(response.data.nozzleReadings);
                setLoading(false);
            } catch (err) {
                toast.warning("Unable to fetch data");
                setLoading(false);
            }
        };
        fetchPumpSheetData();
    }, [id]);

    // --- HANDLERS ---
    const handleInputChnge = (e, index) => {
        const { value, name } = e.target;
        if (name) {
            setPurchaseManagement((prev) => ({
                ...prev,
                points: prev.points.map((point, pointIndex) => 
                    pointIndex === index ? { ...point, [name]: value } : point
                ),
            }));
        }
    };

    const handleItemChange = (e, index) => {
        const { value } = e.target;
        setPurchaseManagement((prev) => ({
            ...prev,
            points: prev.points.map((point, pointIndex) =>
                pointIndex === index ? { ...point, name: value } : point,
            ),
        }));
    };

    const handleNozzleReadingChange = (e, index, field) => {
        const updatedNozzleReadings = [...nozzleReadings];
        updatedNozzleReadings[index][field] = e.target.value;
        setNozzleReadings(updatedNozzleReadings);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...purchaseManagement,
            rate,
            paytm,
            sale,
            date,
            nozzleReadings,
        };
        try {
            await axiosInstance.put(`/newlekhajokha/${id}`, data);
            toast.success("Lekhajokha updated successfully!");
        } catch (error) {
            toast.warning("Error updating Lekhajokha!");
        }
    };

    const confirmDeleteToast = (onConfirm) => {
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-gray-800">Are you sure you want to delete this?</p>
                    <div className="flex gap-3 mt-2">
                        <button onClick={() => { onConfirm(); closeToast(); }} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Yes, Delete</button>
                        <button onClick={closeToast} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">Cancel</button>
                    </div>
                </div>
            ),
            { position: "top-center", autoClose: false, closeOnClick: false }
        )
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        confirmDeleteToast(async () => {
            try {
                await axiosInstance.delete(`/newlekhajokha/${id}`);
                navigate("/lekhajokha");
                toast.success("Lekhajokha deleted successfully!");
            } catch (error) {
                toast.error("Error deleting Lekhajokha!");
            }
        })
    }

    const handleDate = () => {
        if (!date) return "N/A";
        const dateObject = new Date(date);
        return dateObject.toLocaleDateString("en-GB", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-blue-600 font-medium">
                Loading Report...
            </div>
        );
    }

    if (!purchaseManagement || !purchaseManagement.points) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500">No report found.</p>
                <Link to="/lekhajokha" className="text-blue-600 hover:underline">Go Back</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
            <form onSubmit={handleSubmit}>
                
                {/* --- STICKY HEADER --- */}
                <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <Link to={'/lekhajokha'} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition">
                            <FaArrowLeft />
                         </Link>
                         <div>
                            <h1 className="text-lg font-bold text-gray-800 sm:text-xl">Update Lekha Jokha</h1>
                            <p className="text-xs text-gray-500 hidden sm:block">User: {purchaseManagement.username}</p>
                         </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            type="button" 
                            onClick={handleDelete}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-200"
                            title="Delete Report"
                        >
                            <FaTrash />
                        </button>
                        <button 
                            type="submit" 
                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg transform active:scale-95"
                        >
                            <FaSave /> <span className="hidden sm:inline">Update</span>
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                    {/* --- CARD 1: General Information --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">General Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            {/* Date (Read-Only) */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Date</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        readOnly
                                        value={handleDate()}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Rate */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Petrol Rate</label>
                                <div className="relative">
                                    <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Sale Amount */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Sale Amount</label>
                                <div className="relative">
                                    <FaChartLine className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        value={sale}
                                        onChange={(e) => setSale(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Paytm */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Paytm Amount</label>
                                <div className="relative">
                                    <FaWallet className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        value={paytm}
                                        onChange={(e) => setPaytm(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Shift */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Shift</label>
                                <div className="relative">
                                    <FaClock className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        value={shift}
                                        onChange={(e) => setShift(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* --- CARD 2: Stock Report (Points) --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                            <FaLayerGroup className="text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-800">Stock Report</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase w-10">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[200px]">Product Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[100px]">Opening</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[100px]">Sale</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[100px]">Leakage</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[100px]">Add</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[100px]">Closing</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {purchaseManagement.points.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2 text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(e, index)}
                                                    className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none py-1 text-sm font-medium"
                                                />
                                            </td>
                                            {['opening', 'sale', 'leakage', 'add', 'closing'].map((field) => (
                                                <td key={field} className="px-2 py-2">
                                                    <input
                                                        type="number"
                                                        name={field}
                                                        value={item[field]}
                                                        onChange={(e) => handleInputChnge(e, index)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- CARD 3: Nozzle Readings --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                            <FaGasPump className="text-red-500" />
                            <h2 className="text-lg font-bold text-gray-800">Nozzle Readings</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase w-10">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[120px]">Nozzle</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[150px]">Reading</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[120px]">Testing (Ltr)</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase min-w-[120px]">Pending (Ltr)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {nozzleReadings.map((reading, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2 text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-2 text-sm font-semibold text-gray-700">Nozzle {index + 1}</td>
                                            <td className="px-4 py-2">
                                                <input 
                                                    type="number" 
                                                    value={reading.reading} 
                                                    onChange={(e) => handleNozzleReadingChange(e, index, 'reading')} 
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input 
                                                    type="number" 
                                                    value={reading.testing} 
                                                    onChange={(e) => handleNozzleReadingChange(e, index, 'testing')} 
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input 
                                                    type="text" 
                                                    value={reading.pending} 
                                                    onChange={(e) => handleNozzleReadingChange(e, index, 'pending')} 
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
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

export default UpdateSaleManagement;