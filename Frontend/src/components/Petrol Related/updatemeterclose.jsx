import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Binimage from '/public/bin.png';
import previousImage from '/public/previous.png';
import saveImage from '/public/save.png';
import { Link, useParams, useNavigate } from 'react-router-dom';

const Meterclose = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [date, setDate] = useState('');
    const [cashUnknown, setCashUnknown] = useState('');
    const [cashMs, setCashMs] = useState('');
    const [cashSp, setCashSp] = useState('');
    const [crSalesMs, setCrSalesMs] = useState('');
    const [u2, setU2] = useState('');
    const [rate, setRate] = useState('');
    const [items, setItems] = useState([
        'Opening Meter',
        'Sales',
        'Total',
        'Oil',
        'Totals',
        'Testing',
        'Closing Meter',
    ]);
    const [inputs, setInputs] = useState({
        points: items.map((item) => ({
            name: item,
            n1: '',
            n2: '',
            n3: '',
            n4: '',
            n5: '',
            n6: '',
        })),
        items1: Array.from({ length: 7 }, () => ({
            sno: '',
            name: '',
            qnty: '',
            amt: '',
            oilqty: '',
            oilamt: '',
            total: '',
        })),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5500/meterclose/${id}`);
                const fetchedData = response.data;
                setData(fetchedData);
                console.log(fetchedData);
                setDate(fetchedData.date);
                setCashUnknown(fetchedData.cashUnknown);
                setCashMs(fetchedData.cashMs);
                setCashSp(fetchedData.cashSp);
                setCrSalesMs(fetchedData.crSalesMs);
                setU2(fetchedData.u2);
                setRate(fetchedData.rate);
                setInputs(fetchedData.inputs);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e, index, type) => {
        const { id, value } = e.target;
        if (type === 'points') {
            setInputs((prevInputs) => ({
                ...prevInputs,
                points: prevInputs.points.map((point, pointIndex) =>
                    pointIndex === index ? { ...point, [id]: value } : point
                ),
            }));
        } else {
            setInputs((prevInputs) => ({
                ...prevInputs,
                items1: prevInputs.items1.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, [id]: value } : item
                ),
            }));
        }
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
            cashUnknown,
            cashMs,
            cashSp,
            crSalesMs,
            u2,
            inputs,
        };

        if (JSON.stringify(originalData) !== JSON.stringify(updatedData)) {
            try {
                const response = await axios.put(`http://localhost:5500/meterclose/${id}`, updatedData);
                alert('Meter Close updated successfully!');
            } catch (error) {
                alert('Error updating Meter Close!');
            }
        } else {
            alert('No changes made. Data saved without changes.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                const response = await axios.delete(`http://localhost:5500/meterclose/${id}`);
                if (response.status === 200) {
                    alert('Meter Close deleted successfully!');
                    navigate('/createmeterclose');
                } else {
                    alert('Error deleting Meter Close!');
                }
            } catch (error) {
                alert('Error deleting Meter Close!');
            }
        }
    };
    const datee = date.split('T')[0];



    
    return (
        <div className="relative p-6 bg-gradient-to-r from-gray-200 to-white min-h-screen">
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6">
                    <Link to={'/createmeterclose'}>
                        <img src={previousImage} width={50} alt="Back" />
                    </Link>
                    <div>
                        <div className="grid mb-4 grid-row-2 items-center gap-2">
                            <h1 className="text-4xl font-bold text-gray-800 text-center">Meter Close</h1>
                            <input
                                className="border-2 border-gray-300 rounded-md p-2"
                                value={datee}
                            />
                        </div>
                        <div>
                            <input
                                className="border-2 border-gray-300 rounded-md p-2"
                                type="number"
                                value={rate}
                                placeholder="Petrol Rate"
                                onChange={handleRateChange}
                            />
                        </div>
                        <div>
                            <img className='mt-4 mx-auto' onClick={handleDelete} src={Binimage} alt="Delete" width={50} height={50} />
                        </div>
                    </div>
                    <button type="submit">
                        <img src={saveImage} width={50} alt="Save" />
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md mt-6 mb-6">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Nozzle 1</th>
                                <th className="p-3 text-left">Nozzle 2</th>
                                <th className="p-3 text-left">Nozzle 3</th>
                                <th className="p-3 text-left">Nozzle 4</th>
                                <th className="p-3 text-left">Nozzle 5</th>
                                <th className="p-3 text-left">Nozzle 6</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.points && data.points.map((point, index) => (
                                <tr key={index}>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            value={point.name}
                                            onChange={(e) => handleInputChange(e, index, 'points')}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    {(index === 2) ? (
                                        <>
                                            <td className="p-3">{ data.totaln1}</td>
                                            <td className="p-3">{  data.totaln2 }</td>
                                            <td className="p-3">{ data.totaln3}</td>
                                            <td className="p-3">{ data.totaln4}</td>
                                            <td className="p-3">{ data.totaln5}</td>
                                            <td className="p-3">{data.totaln6 }</td>
                                        </>
                                    ) : (index === 4) ? (
                                        <>
                                            <td className="p-3">{ data.totals1}</td>
                                            <td className="p-3">{ data.totals2}</td>
                                            <td className="p-3">{ data.totals3}</td>
                                            <td className="p-3">{ data.totals4}</td>
                                            <td className="p-3">{ data.totals5}</td>
                                            <td className="p-3">{ data.totals6}</td>
                                        </>
                                    ) : (index === 6) ? (
                                        <>
                                            <td className="p-3">{ data.closingMetern1}</td>
                                            <td className="p-3">{ data.closingMetern2}</td>
                                            <td className="p-3">{data.closingMetern3 }</td>
                                            <td className="p-3">{data.closingMetern4 }</td>
                                            <td className="p-3">{data.closingMetern5 }</td>
                                            <td className="p-3">{data.closingMetern6 }</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n1"
                                                    value={point.n1}
                                                    onChange={(e) => handleInputChange(e, index, 'points')}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n2"
                                                    value={point.n2}
                                                    onChange={(e) => handleInputChange(e, index, 'points')}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n3"
                                                    value={point.n3}
                                                    onChange={(e) => handleInputChange(e, index, 'points')}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n4"
                                                    value={point.n4}
                                                    onChange={(e) => handleInputChange(e, index, 'points')}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n5"
                                                    value={point.n5}
                                                    onChange={(e) => handleInputChange(e, index, 'points')}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n6"
                                                    value={point.n6}
                                                    onChange={(e) => handleInputChange(e, index, 'points')}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
        </div>
    );
};

export default Meterclose;