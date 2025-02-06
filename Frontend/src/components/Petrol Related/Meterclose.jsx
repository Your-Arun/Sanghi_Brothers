import React, { useState } from "react";
import previousImage from "/public/previous.png";
import saveImage from "/public/save.png";
import { Link } from "react-router-dom";
import axios from "axios";

const Lekhajokha = () => {
    const [date, setDate] = useState('');
    const [rate, setrate] = useState('');
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
        '1 Ltr 2T oil Bottle',
        '250 ml 2T oil Bottle',
        '60 ml 2T oil Pouch',
        '40 ml 2T oil Pouch',
        '20 ml 2T oil Pouch',
        '1 Ltr NXT oil Bottle',
        '900 NXT oil Bottle',
        '1 Ltr 4T Plus oil bottle',
        '900 ml 4T plus oil bottle',
        '900 ml scootech oil bottle',
        '1 Ltr Redi-cool',
        '500ml Redi-cool',
        '',
        '',
        '',
    ]);
    const [inputs, setInputs] = useState({
        points: item.map((item) => ({
            sno: "",
            name: item,
            opening: "",
            sale: "",
            leakage: "",
            add: "",
            closing: "",
        })),
    });

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
        const updatedItems = [...item];
        updatedItems[index] = e.target.value;
        setItem(updatedItems);
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
            rate: rate,
            sale: sale,
            paytm: paytm,
            shift: selectedShift,
            points: inputs.points.map((point) => ({
                ...point,
                name: item[inputs.points.indexOf(point)],
            })),
            nozzleReadings: nozzleReadings,
        };
        try {
            const response = await axios.post("http://localhost:5500/newlekhajokha", data);
            console.log(response.data);
            alert("Lekha Jokha saved successfully!");
        } catch (error) {
            alert("Error saving Lekha Jokha!");
        }
    };

    const handleShiftChange = (e) => {
        setSelectedShift(e.target.value);
    };

    const handleNozzleReadingChange = (e, index) => {
        const { id, value } = e.target;
        setNozzleReadings((prevNozzleReadings) => {
            const updatedNozzleReadings = [...prevNozzleReadings];
            updatedNozzleReadings[index][id] = value;
            return updatedNozzleReadings;
        });
    };

    return (
        <div className="relative p-6 bg-gradient-to-r from-gray-200 to-white min-h-screen">
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6">
                    <Link to={"/lekhajokha"}>
                        <img src={previousImage} width={50} alt="Back" />
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800 text-center">Lekha Jokha</h1>
                    <button type="submit">
                        <img src={saveImage} width={50} alt="Save" />
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between mb-4">
                        <div className="w-1/3">
                           <label htmlFor="rate">Petrol Rate:  <input


                                type="number"
                                id="rate"
                                placeholder="Petrol Rate"
                                value={rate}
                                onChange={(e) => setrate(e.target.value)}
                                className="p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            /></label>
                        </div>
                        <div className="w-1/3 text-center">
                            <label htmlFor="date">Date:  <input
                                type="date"
                                placeholder="Date"
                                value={date}
                                onChange={handleDateChange}

                                className="p-3 w-1/3  border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            /></label>
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


                          <label htmlFor="shift">Shift:  <select
                                value={selectedShift}
                                onChange={handleShiftChange}
                                className="p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                <option value="">Select Shift</option>
                                <option value="Morning">Morning</option>
                                <option value="Evening">Evening</option>
                            </select></label>
                        </div>
                       
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
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
                            {inputs.points.map((point, index) => (
                                <tr key={index}>
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            value={point.name}
                                            onChange={(e) => handleItemChange(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            id="opening"
                                            value={point.opening}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            id="sale"
                                            value={point.sale}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            id="leakage"
                                            value={point.leakage}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            id="add"
                                            value={point.add}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            id="closing"
                                            value={point.closing}
                                            onChange={(e) => handleInputChnge(e, index)}
                                            className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                

            </form>
        </div>
    );
};

export default Lekhajokha;