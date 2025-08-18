import React, { useEffect, useState } from "react";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { Link } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import { toast } from 'react-toastify'

const PurchaseMangement = () => {
    const [date, setDate] = useState('');
    const [items, setItems] = useState([
        "Stock & sale up date in app. Morning",
        "MS Received on Time",
        "Tank no.1.dry",
        "Tank no.2.dry",
        "Payment Done to BPCL for today's Delivery",
        "Planing for indent next day",
        "",
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
            const response = await axiosInstance.post("/mastersheet/purchasemanagement", data);
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



    
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // screen width check
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    }
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm text-center border border-yellow-200">

          {/* Icon circle */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-3xl">💻</span>
          </div>

          {/* Title */}
          <h2 className="mt-12 text-2xl font-extrabold text-gray-800">
            Desktop Only Feature
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-gray-600 leading-relaxed">
            Ye feature sirf <span className="font-semibold text-yellow-600">desktop screen</span> par available hai.
            Apne device ko desktop mode me open kare.
          </p>

          {/* Illustration */}
          <div className="mt-5 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
              alt="Desktop Icon"
              className="w-20 h-20 opacity-90"
            />
          </div>

          {/* Button */}
          <button
            onClick={() => toast.warn("Try opening on desktop!")}
            className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg shadow-md transition"
          >
            Okay, Got It!
          </button>
        </div>
      </div>

    );
  }

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-center  text-4xl p-4 font-bold">PURCHASE MANAGEMENT</h1>
            <form onSubmit={handleSave}>
                <div className="flex justify-evenly items-center  p-4">
                    <Link to={"/mastersheet"}>
                        <div className="">
                            <img src={previousImage} width={50} alt="Back" />
                        </div>
                    </Link>
                    <div><input type="date" id="date" value={date} className="bg-transparent" onChange={handleDateChange} />
                    </div>
                    <div>
                        <button type="submit" className="bg-transparent">
                            <img src={saveImage} width={50} alt="Save" />
                        </button>{" "}
                    </div>
                </div>
               <div className="table-container">
               <table  className="">
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

export default PurchaseMangement;