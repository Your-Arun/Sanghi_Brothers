import React, { useState } from "react";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { Link } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import { toast } from 'react-toastify'

const bpclstatutory = () => {
    const [date, setDate] = useState('');
    const [items, setItems] = useState([
        "DSM Schedule done for tomorrow",
        "DSM Attendance done for yesderday",
        "Finger Print Machine Attendance ",
        "DSM In and Out register maintained",
        "DSM daily New Checklist filled",
        "DSM meeting done?",
        "Salary of Staff overdue?",
        "Incentive of DSM Overdue? ",
        "All DSM/DSW in uniform",
        "All DSM/DSW came on time",
        "Leave application recd.properly",
        "Temprature check of all staff",
        "Any DSM/DSW misbehaviours with ",
        "Any DSM/DSW misbehaviours with ",
        "New Recruitment ",
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
            const response = await axiosInstance.post("/mastersheet/staffmanagement", data);
            toast.success("Staff Management sheet saved successfully!");
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
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-center  text-4xl p-4 font-bold">STAFF MANAGEMENT</h1>
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
                <div className=" table-container">
                <table >
                     <thead>
                        <th className="p-2 border">Point</th>
                        <th className="p-2 border"> Item to Check</th>
                        <th className="p-2 border">Ok</th>
                        <th className="p-2 border">Responsible</th>
                        <th className="p-2 border">Defect Person</th>
                        <th className="p-2 border">Defect Delays Days</th>
                        <th className="p-2 border">Deadline</th>
                        <th className="p-2 border">Comments</th>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                  <td className="p-2 border">
                  {index + 1}
                                </td>
                                <td className="p-2 border">
                                <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleItemChange(e, index)}
                                    />
                                </td>
                                <td className="p-2 border">
                                <input
                                        type="checkbox"
                                        id="ok"
                                        checked={inputs.points[index].ok}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td className="p-2 border">
                                <input
                                        type="text"
                                        id="responsible"
                                        value={inputs.points[index].responsible}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td className="p-2 border">
                                <input
                                        type="text"
                                        id="defectPerson"
                                        value={inputs.points[index].defectPerson}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td className="p-2 border">
                                <input
                                        type="text"
                                        id="defectDelaysDays"
                                        value={inputs.points[index].defectDelaysDays}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td className="p-2 border">
                                <input
                                        type="text"
                                        id="deadline"
                                        value={inputs.points[index].deadline}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td className="p-2 border">
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
    );
};

export default bpclstatutory;