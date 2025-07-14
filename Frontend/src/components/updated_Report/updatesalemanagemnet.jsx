import axiosInstance from '../Dashboard/axiosInstance'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import binImage from "/bin.png";
import previousImage from "/previous.png";
import saveImage from "/save.png";
import { toast } from 'react-toastify';

const updatesalemanagemnet = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [salemgnemt, setSalemagnmnet] = useState({
        date: '',
        points: []
    });
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [points, setPoints] = useState([]);
    const [items, setItems] = useState([
        "Yesterday's Sale Report Checked",
        "Petrol  loss Reconciliation  +/-,tankwise",
        "Sales Invoices Feed in computer",
        "Paytm Amount check shiftwise",
        "Credit Card check shiftwise",
        "All Sales check nozzle wise with amount",
        "MPD Rate Change done before 6AM (Automation)",
        "Non Space Rate Change done before 6AM (Automation)",
        "Opening time before 6AM?",
        "Customer Complain received yesterday?",
        "5 ltr  testing done  from all nozzles",
        "All standys taken out 2 nos",
        "Air facilities available",
        "Check shiftwise sale for DSM/DSW",
        "Bpcl register done",
        "All 6 nozzle work propely",
        "Any complain book to bpcl ",
        "Proper debit note fill up",
        "Morning density put in register both tank",
        "Today decant density put in register both tank",
        "Proper direction given to customer",
        "Oil change Machine taken out",
        "Camper for drinking water 2 nos taken out",
        "Stock board update taken out morning",
        "Both tank check with water paste",
        "Air machine working",
        "Paytm code for all staff",
        "Pending slip check",
        "Any Nozzle +/- Delilverd report",
        "Cleaning of 4 wheeler glass taken out",
        "Automation mismatch report",
        "Peo cleaning",
        "Fire extinguisher checked daily",
        "Complain book in bpcl resolved",
        "Any maintance work",
        '',
        ''
    ]);

    useEffect(() => {
        const fetchPumpSheetData = async () => {
            try {
                const response = await axiosInstance.get(
                    `/mastersheet/salesmanagementsheet/${id}`
                );
                setSalemagnmnet(response.data);
                setDate(response.data.dat2);
                setPoints(response.data.points);
                setLoading(false);
            } catch (err) {
                alert("Fetch nhh hora");
            } finally {
                setLoading(false);
            }
        };
        fetchPumpSheetData();
    }, [id]);

    const handleInputChnge = (e, index) => {
        const { id, name, value, type, checked } = e.target;
        setPoints((prevPoints) => {
            return prevPoints.map((point, pointIndex) => {
                if (pointIndex === index) {
                    if (type === 'checkbox') {
                        return { ...point, [name]: checked };
                    } else {
                        return { ...point, [name]: value };
                    }
                } else {
                    return point;
                }
            });
        });
    };
    const confirmDeleteToast = (onConfirm) => {
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to delete this ?</p>
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={() => {
                                onConfirm()
                                closeToast()
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Yes
                        </button>
                        <button
                            onClick={closeToast}
                            className="bg-gray-300 px-3 py-1 rounded"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        )
    }
    const handleDelete = async (e) => {
        e.preventDefault();
        confirmDeleteToast(async () => {
            try {

                const response = await axiosInstance.delete(
                    `/mastersheet/salesmanagementsheet/${id}`
                );
                navigate("/mastersheet");
                toast.success("Sales management sheet deleted successfully!");

            } catch (error) {
                toast.warn("Error deleting sales management sheet!");
            }
        })
    }
    const handleSave = async (e) => {
        e.preventDefault();
        const data = {
            date: date,
            points: points
        };
        try {
            const response = await axiosInstance.put(
                `/mastersheet/salesmanagementsheet/${id}`,
                data
            );
            toast.success("Sales management sheet saved successfully!");
        } catch (error) {
            toast.warn("Error saving sales management sheet!");
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div
                    className="animate-spin inline-block size-20 border-[6px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                    role="status"
                    aria-label="loading"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (!salemgnemt) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>No report found...</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center ">
                <h1 className="text-center mt-[-30px] text-4xl p-4 font-bold">SALES MANAGEMENT SHEET</h1>
                <form onSubmit={handleSave}>
                    <div className="flex justify-evenly items-center  p-4">
                        <Link to={"/mastersheet"}>
                            <div className="">
                                <img src={previousImage} width={50} alt="Back" />
                            </div>
                        </Link>
                        <div className='col-span-2'>
                            <input className='text-center bg-transparent' type="date" id="date" value={date} readOnly />

                        </div>
                        <div><img src={binImage} onClick={handleDelete} width={50} height={50} className=" " alt="Bin" /></div>

                        <div>
                            <button type="submit" className='bg-transparent'>
                                <img src={saveImage} width={50} alt="Save" />
                            </button>{" "}
                        </div>
                    </div>
                    <div className="table-container">
                        <table>
                        <thead>
                            <th>Point</th>
                            <th>Item to Check</th>
                            <th>Ok</th>
                            <th>Responsible</th>
                            <th>Defect Person</th>
                            <th>Defect Delays Days</th>
                            <th>Deadline</th>
                        </thead>
                        <tbody>
                            {points.map((point, index) => (
                                <tr key={index}>
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {items[index]}
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="ok"
                                            checked={point.ok === true || point.ok === "Yes" || point.ok === "true"}
                                            onChange={(e) => handleInputChnge(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="responsible"
                                            value={point.responsible}
                                            onChange={(e) => handleInputChnge(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="defectPerson"
                                            value={point.defectPerson}
                                            onChange={(e) => handleInputChnge(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="defectDelaysDays"
                                            value={point.defectDelaysDays}
                                            onChange={(e) => handleInputChnge(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="deadline"
                                            value={point.deadline}
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
    )
}

export default updatesalemanagemnet