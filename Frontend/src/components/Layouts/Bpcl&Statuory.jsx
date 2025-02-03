import React, { useState } from "react";
import previousImage from "/public/previous.png";
import saveImage from "/public/save.png";
import { Link } from "react-router-dom";
import axios from "axios";

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
            date: new Date(date).toISOString().split('T')[0],
            points: inputs.points.map((point) => ({
                ...point,
                ok: point.ok,
                itemToCheck: items[inputs.points.indexOf(point)],
            })),
        };
        try {
            const response = await axios.post("http://localhost:5500/mastersheet/bpcl&statutory", data);
          
           
            alert("BPCL % Statutory management sheet saved successfully!");
        } catch (error) {
            alert("Error saving sales management sheet!");
        }
    };

    const handleItemChange = (e, index) => {
        const updatedItems = [...items];
        updatedItems[index] = e.target.value;
        setItems(updatedItems);
    };
    return (
        <>
            <div>
                <h1 className="text-center mt-[-30px] text-2xl p-4 font-bold">BPCL & STATUTORY MANAGEMENT</h1>
                <form onSubmit={handleSave}>
                    <div className="flex justify-evenly items-center  p-4">
                        <Link to={"/mastersheet"}>
                            <div className="">
                                <img src={previousImage} width={50} alt="Back" />
                            </div>
                        </Link>
                        <div><input type="date" id="date" value={date} onChange={handleDateChange} />
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
        </>
    );
};

export default bpclstatutory;