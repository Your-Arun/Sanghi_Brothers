import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import binImage from "/bin.png";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import BackButton from "../Home Page/backbutton";

const UpdateSaleManagement = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [rate, setRate] = useState('');
    const [paytm, setPaytm] = useState('');
    const [sale, setSale] = useState('');
    const [shift, setShift] = useState('');
    const [purchaseManagement, setPurchaseManagement] = useState({
        date: "",
        points: [],
    });
    const navigate = useNavigate();
    const [date, setDate] = useState("");
    const [nozzleReadings, setNozzleReadings] = useState([
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
        { reading: '', testing: '', pending: '' },
    ]);

    useEffect(() => {
        const fetchPumpSheetData = async () => {
            try {
                const response = await axios.get(`http://localhost:5500/newlekhajokha/${id}`);
                setPurchaseManagement(response.data);
                setDate(response.data.date);
                setRate(response.data.rate);
                setPaytm(response.data.paytm);
                setSale(response.data.sale);
                setShift(response.data.shift);
                setNozzleReadings(response.data.nozzleReadings);
                setLoading(false);
            } catch (err) {
                alert("Unable to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchPumpSheetData();
    }, [id]);

    const handleInputChnge = (e, index) => {
        const { value, name } = e.target;
        if (name) {
            setPurchaseManagement((prevPurchaseManagement) => {
                return {
                    ...prevPurchaseManagement,
                    points: prevPurchaseManagement.points.map((point, pointIndex) => {
                        if (pointIndex === index) {
                            return { ...point, [name]: value };
                        } else {
                            return point;
                        }
                    }),
                };
            });
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            if (window.confirm("Are you sure you want to delete this Lekhajokha?")) {
                await axios.delete(`http://localhost:5500/newlekhajokha/${id}`);
                navigate("/lekhajokha");
                alert("Lekhajokha deleted successfully!");
            }
        } catch (error) {
            alert("Error deleting Lekhajokha!");
        }
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
            const response = await axios.put(`http://localhost:5500/newlekhajokha/${id}`, data);
            alert("Lekhajokha updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Error updating Lekhajokha!");
        }
    };

    const handleItemChange = (e, index) => {
        const { value } = e.target;
        setPurchaseManagement((prevPurchaseManagement) => ({
            ...prevPurchaseManagement,
            points: prevPurchaseManagement.points.map((point, pointIndex) =>
                pointIndex === index ? { ...point, name: value } : point,
            ),
        }));
    };

    const handleNozzleReadingChange = (e, index, field) => {
        const updatedNozzleReadings = [...nozzleReadings];
        updatedNozzleReadings[index][field] = e.target.value;
        setNozzleReadings(updatedNozzleReadings);
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

    if (!purchaseManagement || !purchaseManagement.points) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>No report found...</p>
            </div>
        );
    }

    const handleDate = () => {
        const dateObject = new Date(date);
        const day = dateObject.getDate().toString().padStart(2, "0");
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObject.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="relative p-6 dashboard bg-gray-100">
            <form onSubmit={handleSubmit}>
                <div>
                    <h1 className="text-4xl mb-10 font-bold text-center">Lekha Jokha</h1>
                    <div className="flex justify-evenly items-center p-4">
                        <div className="grid grid-row-2">
                            <div>
                                <h1 className="text-2xl mb-10  mt-[-40px] font-bold text-center">{purchaseManagement.username}</h1>
                            </div>
                            <div className="cursor-pointer mx-auto">
                                <img src={binImage} onClick={handleDelete} width={50} alt="Delete" />
                            </div>
                        </div>
                        <div>
                            <button type="submit">
                                <img src={saveImage} width={50} alt="Save" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div>
                        <div className="flex justify-between mb-4">
                            <div className="w-1/3">
                                <label htmlFor="rate">Petrol Rate:  <input
                                    type="number"
                                    id="rate"
                                    placeholder="Petrol Rate"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}

                                    className="p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                /></label>
                            </div>
                            <div className="w-1/3 text-center">
                                <strong>Date: {handleDate()}</strong>
                            </div>
                            <div className="w-1/3">
                                <label htmlFor="pytm">PAYTM Amount:  <input
                                    type="number"
                                    id="paytm"
                                    placeholder="PAYTM Amount"
                                    value={paytm}
                                    onChange={(e) => setPaytm(e.target.value)}

                                    className="p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                /></label>
                            </div>
                        </div>

                        <div className="flex justify-between mb-4">
                            <div className="w-1/3">
                                <label htmlFor="sale">Sale Amount:  <input
                                    type="number"
                                    id="sale"
                                    placeholder="Sale Amount"
                                    value={sale}
                                    onChange={(e) => setSale(e.target.value)}

                                    className="p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                /></label>
                            </div>

                            <div className="w-1/3">
                                <label htmlFor="shift">Shift:  <input
                                    type="text"
                                    value={shift}
                                    onChange={(e) => setShift(e.target.value)}
                                    placeholder="Shift"

                                    className="p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                /></label>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">S No.</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Opening</th>
                                <th className="p-3 text-left">Sale</th>
                                <th className="p-3 text-left">Leakage</th>
                                <th className="p-3 text-left">Add</th>
                                <th className="p-3 text-left">Closing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseManagement.points && purchaseManagement.points.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            name="name"
                                            value={item.name}
                                            onChange={(e) => handleItemChange(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            name="opening"
                                            value={item.opening}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            name="sale"
                                            value={item.sale}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            name="leakage"
                                            value={item.leakage}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            name="add"
                                            value={item.add}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            name="closing"
                                            value={item.closing}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">S No.</th>
                                <th className="p-3 text-left">Nozzle</th>
                                <th className="p-3 text-left">Reading</th>
                                <th className="p-3 text-left">Testing (Ltr)</th>
                                <th className="p-3 text-left">Pending (Ltr)</th>
                            </tr>

                        </thead>
                        <tbody>
                            {nozzleReadings && nozzleReadings.map((reading, index) => (
                                <tr key={index}>
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">Nozzle {index + 1}</td>
                                    <td className="p-3"><input type="number" id="reading" value={reading.reading} onChange={(e) => handleNozzleReadingChange(e, index, 'reading')} /></td>
                                    <td className="p-3"><input type="number" id="testing" value={reading.testing} onChange={(e) => handleNozzleReadingChange(e, index, 'testing')} /></td>
                                    <td className="p-3"><input type="text" id="pending" value={reading.pending} onChange={(e) => handleNozzleReadingChange(e, index, 'pending')} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
            <BackButton previousImage="/previous.png" />
        </div>
    );
};

export default UpdateSaleManagement;