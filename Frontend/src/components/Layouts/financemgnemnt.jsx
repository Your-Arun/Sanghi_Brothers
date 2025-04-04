import React, { useState } from "react";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { Link } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import { toast } from 'react-toastify'


const bpclstatutory = () => {
    const [date, setDate] = useState('');

    const [items, setItems] = useState([
        "Paytm amount received for yesterday",
        "Credit Card amt recd for yesterday",
        "All Sales Cash Received for Yesterday",
        "Short amount recd.from dsm/dsw",
        "Any excess amount recd.in cards/paytm/Staff",
        "Cash deposit in to bank",
        "Any transfer entry",
        "All voucher prepare & sign.",
        "All voucher enter in computer",
        "Fund flow planing",
        "Bank reconcilation(all bank)",
        "Bpcl account reconcilation	",
        "Credit bills prepare & Mail send",
        "TDS / GST challan dt.7 & 20		",
        "GST / TDS RETURN Quaterly FILE	",
        "Monthly pur / stock position to DSO	",
        "Monthly pur / stock position to SBI	",
        "Cash book check & sign.			",
        "Time to time insurance of vehicles	",
        "Personal insurance payment		",
        "Personal accounting			",
        "Pirates accounting			",
        "Sanghi ventures accounting		",
        "W I S M LTD accounting		",
        "All passbook update			",
        "Fund manage for emi(7)		",
        "ESI / PF challan deposit	",
        "Debtors payment followup		",
        "Credit bills check & deliverd 	",
        "Pirates Authours Royalty quartly	",
        "I tax returns of firms AY 2023 - 24",
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
            const response = await axiosInstance.post("/mastersheet/finance", data);
            toast.success("Finance  Management sheet saved successfully!");
        } catch (error) {
            toast.warn("Error saving finance management sheet!");
        }
    };

    const handleItemChange = (e, index) => {
        const updatedItems = [...items];
        updatedItems[index] = e.target.value;
        setItems(updatedItems);
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-center text-2xl p-4 font-bold">FINANCE MANAGEMENT</h1>
            <form onSubmit={handleSave}>
                <div className="flex justify-evenly items-center  p-4">
                    <Link to={"/mastersheet"}>
                        <div className="">
                            <img src={previousImage} width={50} alt="Back" />
                        </div>
                    </Link>
                    <div><input type="date" className="bg-transparent" id="date" value={date} onChange={handleDateChange} />
                    </div>
                    <div>
                        <button type="submit">
                            <img src={saveImage} width={50} alt="Save" />
                        </button>{" "}
                    </div>
                </div>
                <table>
                    <thead>
                        <th>Point</th>
                        <th>Item to Check</th>
                        <th>Ok</th>
                        <th>Responsible</th>
                        <th>Defect Person</th>
                        <th>Defect Delays Days</th>
                        <th>Deadline</th>
                        <th>Remark</th>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {index + 1}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleItemChange(e, index)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        id="ok"
                                        checked={inputs.points[index].ok}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="responsible"
                                        value={inputs.points[index].responsible}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="defectPerson"
                                        value={inputs.points[index].defectPerson}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="defectDelaysDays"
                                        value={inputs.points[index].defectDelaysDays}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="deadline"
                                        value={inputs.points[index].deadline}
                                        onChange={(e) => handleInputChnge(e, index)}
                                    />
                                </td>
                                <td>
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
            </form>
        </div>
    );
};

export default bpclstatutory;