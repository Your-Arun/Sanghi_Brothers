import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Binimage from '/bin.png';
import previousImage from '/previous.png';
import saveImage from '/save.png';
import { Link, useParams, useNavigate } from 'react-router-dom';

const UpdateMeterclose = () => {
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
                setInputs(fetchedData);
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
            cashUnknown,
            cashMs,
            cashSp,
            crSalesMs,
            u2,
            points: inputs.points,  // Include this
            items1: inputs.items1,  // Include this
            totaln1,
            totaln2,
            totaln3,
            totaln4,
            totaln5,
            totaln6,
            totals1,
            totals2,
            totals3,
            totals4,
            totals5,
            totals6,
            closingMetern1,
            closingMetern2,
            closingMetern3,
            closingMetern4,
            closingMetern5,
            closingMetern6,
        };
    
        if (JSON.stringify(originalData) !== JSON.stringify(updatedData)) {
            try {
                const response = await axios.put(`http://localhost:5500/meterclose/${id}`, updatedData);
                console.log(response.data); // Debugging
                alert('Meter Close updated successfully!');
            } catch (error) {
                console.error(error.response?.data || error.message); // Debugging errors
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
 const openingMeterIndex = items.indexOf('Opening Meter');
    const salesIndex = items.indexOf('Sales');
    const oilIndex = items.indexOf('Oil');
    const totalsIndex = items.indexOf('Totals');
    const testingIndex = items.indexOf('Testing');
    const openingMeterValues = inputs.points[openingMeterIndex];
    const salesValues = inputs.points[salesIndex];
    const oilValues = inputs.points[oilIndex];
    const totalsValues = inputs.points[totalsIndex];
    const testingValues = inputs.points[testingIndex];
    const nozzleValues = {
        n1: salesValues.n1,
        n2: salesValues.n2,
        n3: salesValues.n3,
        n4: salesValues.n4,
        n5: salesValues.n5,
        n6: salesValues.n6
    };
    const totalOpeningMeter = {
        n1: openingMeterValues.n1,
        n2: openingMeterValues.n2,
        n3: openingMeterValues.n3,
        n4: openingMeterValues.n4,
        n5: openingMeterValues.n5,
        n6: openingMeterValues.n6
    };

    const totaln1 = parseInt(totalOpeningMeter.n1) + parseInt(nozzleValues.n1) || 0;
    const totaln2 = parseInt(totalOpeningMeter.n2) + parseInt(nozzleValues.n2) || 0;
    const totaln3 = parseInt(totalOpeningMeter.n3) + parseInt(nozzleValues.n3) || 0;
    const totaln4 = parseInt(totalOpeningMeter.n4) + parseInt(nozzleValues.n4) || 0;
    const totaln5 = parseInt(totalOpeningMeter.n5) + parseInt(nozzleValues.n5) || 0;
    const totaln6 = parseInt(totalOpeningMeter.n6) + parseInt(nozzleValues.n6) || 0;

    const oilValuesCalculated = {
        n1: oilValues.n1,
        n2: oilValues.n2,
        n3: oilValues.n3,
        n4: oilValues.n4,
        n5: oilValues.n5,
        n6: oilValues.n6
    };

    const totals1 = parseInt(totaln1) + parseInt(oilValuesCalculated.n1) || 0;
    const totals2 = parseInt(totaln2) + parseInt(oilValuesCalculated.n2) || 0;
    const totals3 = parseInt(totaln3) + parseInt(oilValuesCalculated.n3) || 0;
    const totals4 = parseInt(totaln4) + parseInt(oilValuesCalculated.n4) || 0;
    const totals5 = parseInt(totaln5) + parseInt(oilValuesCalculated.n5) || 0;
    const totals6 = parseInt(totaln6) + parseInt(oilValuesCalculated.n6) || 0;

    const closingMetern1 = parseInt(oilValuesCalculated.n1) + parseInt(totaln1) + parseInt(testingValues.n1) || 0;
    const closingMetern2 = parseInt(oilValuesCalculated.n2) + parseInt(totaln2) + parseInt(testingValues.n2) || 0;
    const closingMetern3 = parseInt(oilValuesCalculated.n3) + parseInt(totaln3) + parseInt(testingValues.n3) || 0;
    const closingMetern4 = parseInt(oilValuesCalculated.n4) + parseInt(totaln4) + parseInt(testingValues.n4) || 0;
    const closingMetern5 = parseInt(oilValuesCalculated.n5) + parseInt(totaln5) + parseInt(testingValues.n5) || 0;
    const closingMetern6 = parseInt(oilValuesCalculated.n6) + parseInt(totaln6) + parseInt(testingValues.n6) || 0;

    const totalCredit = parseInt(cashUnknown)+parseInt(cashMs) + parseInt(cashSp) + parseInt(crSalesMs) + parseInt(u2) || 0;

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
                                type="date"
                                name="date"
                                id="date"
                                value={datee}
                                onChange={handleDateChange}
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
                            {inputs.points.map((point, index) => (
                                <tr key={index}>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            value={point.name}
                                            onChange={(e) => handleItemChange(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    {(index === 2) ? (
                                        <>
                                            <td className="p-3">{totaln1}</td>
                                            <td className="p-3">{totaln2}</td>
                                            <td className="p-3">{totaln3}</td>
                                            <td className="p-3">{totaln4}</td>
                                            <td className="p-3">{totaln5}</td>
                                            <td className="p-3">{totaln6}</td>
                                        </>
                                    ) : (index === 4) ? (
                                        <>
                                            <td className="p-3">{totals1}</td>
                                            <td className="p-3">{totals2}</td>
                                            <td className="p-3">{totals3}</td>
                                            <td className="p-3">{totals4}</td>
                                            <td className="p-3">{totals5}</td>
                                            <td className="p-3">{totals6}</td>
                                        </>
                                    ) : (index === 6) ? (
                                        <>
                                            <td className="p-3">{closingMetern1}</td>
                                            <td className="p-3">{closingMetern2}</td>
                                            <td className="p-3">{closingMetern3}</td>
                                            <td className="p-3">{closingMetern4}</td>
                                            <td className="p-3">{closingMetern5}</td>
                                            <td className="p-3">{closingMetern6}</td>
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
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-6  ">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h2 />
                                    </td>
                                    <td>
                                        <input type="number" name="cashUnknown" value={cashUnknown} onChange={(e) => setCashUnknown(e.target.value)} id="cashUnknown" />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <h2>Cash MS</h2>
                                    </td>
                                    <td>
                                        <input type="number" name="cashMs" id="cashMs" value={cashMs} onChange={(e) => setCashMs(e.target.value)} />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <h2>Cash SP</h2>
                                    </td>
                                    <td>
                                        <input type="number" name="cashSp" id="cashSp" value={cashSp} onChange={(e) => setCashSp(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>

                                    <td>
                                        <h2>CR. Sale M.S</h2>
                                    </td>
                                    <td>
                                        <input type="number" name="crSalesMs" id="crSalesMs" value={crSalesMs} onChange={(e) => setCrSalesMs(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>

                                    <td>
                                        <h2 />
                                    </td>
                                    <td>
                                        <input type="number" name="u2" id="u2" value={u2} onChange={(e) => setU2(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h2 />
                                    </td>
                                    <td>{totalCredit}</td>
                                </tr>
                                <tr>
                                    <td>


                                        <h2 />
                                    </td>
                                    <td>CREDIT</td>
                                    <td>SALE</td>
                                    <td>M.S</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-6">
                        <table>
                            <thead>
                                <tr>
                                    <th>S No.</th>
                                    <th>NAME</th>
                                    <th>Qnty</th>
                                    <th>Amt</th>
                                    <th>Oil qty.</th>
                                    <th>Oil Amt</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 7 }, (_, index) => (
                                    <tr key={index}>
                                        <td><input type="number" className='w-[70px]' id="sno" value={inputs.items1[index].sno} onChange={(e) => handleInputChange(e, index, 'items1')} placeholder={index + 1} /></td>
                                        <td><input
                                            type="text"
                                            id="name"
                                            value={inputs.items1[index].name}
                                            onChange={(e) => handleInputChange(e, index, 'items1')}
                                            placeholder="Name"
                                            className="p-2 w-[180px] border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        /></td>
                                        <td><input type="number" id="qnty" className='w-[70px]' value={inputs.items1[index].qnty} onChange={(e) => {
                                            const qnty = e.target.value || 0;
                                            const amt = qnty * rate;
                                            handleInputChange(e, index, 'items1');
                                            setInputs((prevInputs) => ({
                                                ...prevInputs,
                                                items1: prevInputs.items1.map((item, itemIndex) => (itemIndex === index ? { ...item, amt: amt.toFixed(2) } : item))
                                            }));
                                        }} /></td>
                                        <td><input type="number" id="amt" readOnly className='w-[90px]' value={inputs.items1[index].amt} onChange={(e) => {
                                            const amt = e.target.value || 0;
                                            const oilamt = inputs.items1[index].oilamt || 0;
                                            const total = parseFloat(amt) + parseFloat(oilamt);
                                            const totsl = total.toFixed(2);
                                            handleInputChange(e, index, 'items1');
                                            setInputs((prevInputs) => ({
                                                ...prevInputs,
                                                items1: prevInputs.items1.map((item, itemIndex) => (itemIndex === index ? { ...item, total: totsl } : item))
                                            }));
                                        }} /></td>

                                        <td><input type="number" id="oilqty" className='w-[70px]' value={inputs.items1[index].oilqty} onChange={(e) => {
                                            handleInputChange(e, index, 'items1');
                                        }} /></td>

                                        <td><input type="number" id="oilamt" className='w-[70px]' value={inputs.items1[index].oilamt} onChange={(e) => {
                                            const oilamt = e.target.value || 0;
                                            const amt = (inputs.items1[index].amt) || 0;
                                            const total = parseFloat(amt) + parseFloat(oilamt);
                                            const totsl = total.toFixed(2);
                                            handleInputChange(e, index, 'items1');
                                            setInputs((prevInputs) => ({
                                                ...prevInputs,
                                                items1: prevInputs.items1.map((item, itemIndex) => (itemIndex === index ? { ...item, total: totsl } : item))
                                            }));
                                        }} /></td>

                                        <td><input type="number" id="total" className='w-[100px]' value={inputs.items1[index].total} readOnly /></td>

                                    </tr>

                                ))}
                                <tr>
                                    <td colSpan={1} />
                                    <td><b>Total:</b></td>
                                    <td><input type="number" id="qnty" className='w-[100px]' value={inputs.items1.reduce((acc, item) => acc + (parseFloat(item.qnty) || 0), 0).toFixed(2)} readOnly /></td>
                                    <td><input type="number" id="amt" className='w-[100px]' value={inputs.items1.reduce((acc, item) => acc + (parseFloat(item.amt) || 0), 0).toFixed(2)} readOnly /></td>
                                    <td><input type="number" id="oiqty" className='w-[100px]' value={inputs.items1.reduce((acc, item) => acc + (parseFloat(item.oilqty) || 0), 0).toFixed(2)} readOnly /></td>
                                    <td><input type="number" id="oilamt" className='w-[100px]' value={inputs.items1.reduce((acc, item) => acc + (parseFloat(item.oilamt) || 0), 0).toFixed(2)} readOnly /></td>
                                    <td><input type="number" id="total" className='w-[100px]' value={inputs.items1.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0).toFixed(2)} readOnly /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateMeterclose;