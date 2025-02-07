import React, { useState } from 'react';
import previousImage from '/public/previous.png';
import saveImage from '/public/save.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Meterclose = () => {
    const [date, setDate] = useState('');
    const [cashunknown, setCashunknown] = useState('');
    const [cashms, setCashms] = useState('');
    const [cashsp, setCashsp] = useState('');
    const [crsalesms, setCrsalesms] = useState('');
    const [u2, setU2] = useState('');
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
        }))
    });
    const handleInputChange = (e, index) => {
        const { id, value } = e.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            points: prevInputs.points.map(
                (point, pointIndex) => (pointIndex === index ? { ...point, [id]: value } : point)
            ),
            items1: prevInputs.items1.map(
                (item, itemIndex) => (itemIndex === index ? { ...item, [id]: value } : item)
            )
        }));

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            date: new Date(date).toISOString().split('T')[0],
            points: inputs.points.map((point) => ({
                ...point,
                name: items[inputs.points.indexOf(point)]
            }))
        };
        try {
            const response = await axios.post('http://localhost:5500/meterclose', data);
            console.log(response.data);
            alert('Meter Close saved successfully!');
        } catch (error) {
            alert('Error saving Meter Close!');
        }
    };

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
    const totalNozzles = {
        n1: totalsValues.n1,
        n2: totalsValues.n2,
        n3: totalsValues.n3,
        n4: totalsValues.n4,
        n5: totalsValues.n5,
        n6: totalsValues.n6
    };
    const oilValuesCalculated = {
        n1: oilValues.n1,
        n2: oilValues.n2,
        n3: oilValues.n3,
        n4: oilValues.n4,
        n5: oilValues.n5,
        n6: oilValues.n6
    };
    const closingMetern1 = parseInt(oilValuesCalculated.n1) + parseInt(totalNozzles.n1) + parseInt(testingValues.n1) || 0;
    const closingMetern2 = parseInt(oilValuesCalculated.n2) + parseInt(totalNozzles.n2) + parseInt(testingValues.n2) || 0;
    const closingMetern3 = parseInt(oilValuesCalculated.n3) + parseInt(totalNozzles.n3) + parseInt(testingValues.n3) || 0;
    const closingMetern4 = parseInt(oilValuesCalculated.n4) + parseInt(totalNozzles.n4) + parseInt(testingValues.n4) || 0;
    const closingMetern5 = parseInt(oilValuesCalculated.n5) + parseInt(totalNozzles.n5) + parseInt(testingValues.n5) || 0;
    const closingMetern6 = parseInt(oilValuesCalculated.n6) + parseInt(totalNozzles.n6) + parseInt(testingValues.n6) || 0;

    const totalcredit = parseInt(cashms) + parseInt(cashsp) + parseInt(crsalesms) + parseInt(u2) || 0;

    return (
        <div className="relative p-6 bg-gradient-to-r from-gray-200 to-white min-h-screen">
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6">
                    <Link to={'/dashboard'}>
                        <img src={previousImage} width={50} alt="Back" />
                    </Link>
                    <div className="grid grid-row-2 items-center gap-2">
                        {' '}
                        <h1 className="text-4xl font-bold text-gray-800 text-center">Meter Close</h1>
                        <input
                            className="border-2 border-gray-300 rounded-md p-2"
                            type="date"
                            name="date"
                            id="date"
                            value={date}
                            onChange={handleDateChange}
                        />
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
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n2"
                                                    value={point.n2}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n3"
                                                    value={point.n3}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n4"
                                                    value={point.n4}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n5"
                                                    value={point.n5}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    id="n6"
                                                    value={point.n6}
                                                    onChange={(e) => handleInputChange(e, index)}
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
                                        <input type="number" name="cashunknown" value={cashunknown} onChange={(e) => setCashunknown(e.target.value)} id="cashunknown" />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <h2>Cash MS</h2>
                                    </td>
                                    <td>
                                        <input type="number" name="cashms" id="cashms" value={cashms} onChange={(e) => setCashms(e.target.value)} />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <h2>Cash SP</h2>
                                    </td>
                                    <td>
                                        <input type="number" name="cashsp" id="cashsp" value={cashsp} onChange={(e) => setCashsp(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>

                                    <td>
                                        <h2>CR. Sale M.S</h2>
                                    </td>
                                    <td>
                                        <input type="number" name="crsalesms" id="crsalesms" value={crsalesms} onChange={(e) => setCrsalesms(e.target.value)} />
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
                                    <td>{totalcredit}</td>
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
                                        <td><input type="number" className='w-[70px]' id="sno" value={inputs.items1[index].sno} onChange={(e) => handleInputChange(e, index)} /></td>
                                        <td><input
                                            type="text"
                                            id="name"
                                            value={inputs.items1[index].name}
                                            onChange={(e) => handleInputChange(e, index)}
                                            className="p-2 w-[180px] border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        /></td>
                                        <td><input type="number" id="qnty" className='w-[70px]' value={inputs.items1[index].qnty} onChange={(e) => handleInputChange(e, index)} /></td>
                                        <td><input type="number" id="amt" className='w-[90px]' value={inputs.items1[index].amt} onChange={(e) => handleInputChange(e, index)} /></td>

                                        <td><input type="number" id="oilqty" className='w-[70px]' value={inputs.items1[index].oilqty} onChange={(e) => handleInputChange(e, index)} /></td>
                                        <td><input type="number" id="oilamt" className='w-[70px]' value={inputs.items1[index].oilamt} onChange={(e) => handleInputChange(e, index)} /></td>

                                        <td><input type="number" id="total" className='w-[100px]' value={inputs.items1[index].total} onChange={(e) => handleInputChange(e, index)} /></td>


                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>


                </div>
            </form>
        </div>
    );
};

export default Meterclose;