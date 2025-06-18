import React, { useState } from "react";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { Link } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import { toast } from 'react-toastify'


const tanklorry = () => {
    const [date, setDate] = useState('');
    const [items, setItems] = useState([
        "Tank lorry lock open ",
        "Tank lorry checked with water/oil paste",
        "Before density check 20 ltr each compartment decant from tank lorry bottom",
        "Check density from each compartment",
        "Invoice density and lorry density ok",
        "Sampling done",
        "Lorry decant with earth wire,stopper & firextu.",
        "Sale stop during decant ",
        "During decant sale stop board taken out",
        "Full lorry decant",
        "After complete decant lorry locked",
        "Lorry decant in two part",
        "In lorry short  received",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        
    ]);


    const [inputs, setInputs] = useState({
        points: items.map((item) => ({
            point: "",
            itemToCheck: item,
            ok: "",
            responsible: "",
            defectPerson: "",
            defectDelaysDays: "",
            deadline: "",
        })),
    });

    const handleInputChnge = (e, index) => {
        const { id, value, checked } = e.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            points: prevInputs.points.map((point, pointIndex) =>
                pointIndex === index ? { ...point, [id]: id === 'ok' ? checked : value } : point
            ),
        }));
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const data = {
            dat2: new Date(date).toISOString().split('T')[0],
            points: inputs.points.map((point) => ({
                ...point,
                ok: point.ok,
                itemToCheck: items[inputs.points.indexOf(point)],
            })),
        };
        try {
            const response = await axiosInstance.post("/mastersheet/tanklorry", data);
            toast.success("Purchase management sheet saved successfully!");
        } catch (error) {
            toast.warn("Error saving sales management sheet!");
        }
    };

    const handleItemChange = (e, index) => {
        const updatedItems = [...items];
        updatedItems[index] = e.target.value;
        setItems(updatedItems);
    };
    return (
        <div className="flex flex-col items-center  bg-gradient-to-r from-blue-400 to-yellow-400 justify-center bg-gray-100 p-6">
            <h1 className="text-center  text-2xl p-4 font-bold">TANK LORRY MANAGEMENT</h1>
            <form onSubmit={handleSave}>
                <div className="flex justify-evenly items-center  p-4">
                    <Link to={"/mastersheet"}>
                        <div className="">
                            <img src={previousImage} width={50} alt="Back" />
                        </div>
                    </Link>
                    <div><input type="date" id="date" className="bg-transparent" value={date} onChange={handleDateChange} />
                    </div>
                    <div>
                        <button type="submit" className="bg-transparent">
                            <img src={saveImage} width={50} alt="Save" />
                        </button>{" "}
                    </div>
                </div>
                <div className="overflow-x-auto w-full max-w-screen-lg mx-auto">
                <table  className="table-auto w-full border-collapse border border-gray-300 text-sm">
                <thead>
                        <th className="p-2 border">Point</th>
                        <th className="p-2 border"> Item to Check</th>
                        <th className="p-2 border">Ok</th>
                        <th className="p-2 border">Responsible</th>
                        <th className="p-2 border">Defect Person</th>
                        <th className="p-2 border">Defect Delays Days</th>
                        <th className="p-2 border">Deadline</th>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                  <td className='p-2 border'>
                  {index + 1}
                                </td>
                                <td className='p-2 border'>
                                <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleItemChange(e, index)}
                                    />
                                </td>
                                <td className='p-2 border'>
                                <input
                                        type="checkbox"
                                        id="ok"
                                        checked={inputs.points[index].ok}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td className='p-2 border'>
                                <input
                                        type="text"
                                        id="responsible"
                                        value={inputs.points[index].responsible}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td className='p-2 border'>
                                <input
                                        type="text"
                                        id="defectPerson"
                                        value={inputs.points[index].defectPerson}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td className='p-2 border'>
                                <input
                                        type="text"
                                        id="defectDelaysDays"
                                        value={inputs.points[index].defectDelaysDays}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td className='p-2 border'>
                                <input
                                        type="text"
                                        id="deadline"
                                        value={inputs.points[index].deadline}
                                        onChange={(e) => handleInputChnge(e, index)}
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

export default tanklorry;