import React, { useState } from "react";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { Link } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import { toast } from 'react-toastify'

const bpclstatutory = () => {
    const [date, setDate] = useState('');
    const [items, setItems] = useState([
        "5 ltr measurement calibrated 20/10/24",
        "MPD calibrated with W/M seal 04/8/25 & 2/5/25",
        "Non space calibrated with W/M seal 04/8/25",
        "Hydro meter calibrated  14/02/25",
        "Thermometer calibrated 7/06/25",
        "Explosive license valid 31/12/24",
        "DSO MS license valid 31/12/24",
        "DSO Oil license valid 17/3/26 ",
        "Fire extinguisher certificate 22/9/25",
        "Air machine calibrated 3/7/25 & 25/6/25",
        "Traffic plan",
        "Drinking water available for customer",
        "Clean toilet 11am & 5 pm",
        "Bpcl MS stock register up date",
        "Bpcl density register",
        "0 shown to customer",
        "Dsm in proper uniform clean I card etc",
        "Display explosive licence",
        "BPCL yearly ledger recosilation",
        "Safety Audit Report up to 24/04/23",
        "ROIR report by SO",
        "Air N2 machine calibrated 04/07/24",
        "",
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
            comment: "",
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
            const response = await axiosInstance.post("/mastersheet/bpcl&statutory", data);
            toast.success("BPCL % Statutory management sheet saved successfully!");
        } catch (error) {
            toast.error("Error saving sales management sheet!");
        }
    };

    const handleItemChange = (e, index) => {
        const updatedItems = [...items];
        updatedItems[index] = e.target.value;
        setItems(updatedItems);
    };
    return (
        <>
            <div className="flex flex-col items-center justify-center p-6">
                <h1 className="text-center  text-4xl p-4 font-bold">BPCL & STATUTORY MANAGEMENT</h1>
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
                    <div className="table-container">
                    <table >
                        <thead>
                        <th className="p-2 border">Point</th>
                        <th className="p-2 border"> Item to Check</th>
                        <th className="p-2 border">Ok</th>
                        <th className="p-2 border">Responsible</th>
                        <th className="p-2 border">Defect Person</th>
                        <th className="p-2 border">Defect Delays Days</th>
                        <th className="p-2 border">Deadline</th>
                        <th className="p-2 border">Remark</th>
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
                                    <td className='p-2 border'>
                                    <input
                                            type="text"
                                            id="comment"
                                            value={inputs.points[index].comment}
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
        </>
    );
};

export default bpclstatutory;