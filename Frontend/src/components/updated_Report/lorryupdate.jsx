import axiosInstance from '../Dashboard/axiosInstance'
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import binImage from "/bin.png"
import previousImage from "/previous.png"
import saveImage from "/save.png"
import { toast } from 'react-toastify'

const tanklorryupdate = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [lorrymgnemt, setLorrymagnmnet] = useState({
    date: "",
    points: [],
  })
  const navigate = useNavigate()
  const [date, setDate] = useState("")
  useEffect(() => {
    const fetchPumpSheetData = async () => {
      try {
        const response = await axiosInstance.get(`/mastersheet/tanklorry/${id}`)
        setLorrymagnmnet(response.data)
        setDate(response.data.dat2)
        setLoading(false)
      } catch (err) {
        toast.warning("Fetch nhh hora")
      } finally {
        setLoading(false)
      }
    }
    fetchPumpSheetData()
  }, [id])

  const handleInputChnge = (e, index) => {
    const { name, value, type, checked } = e.target
    setLorrymagnmnet((prevPurchasemgnemt) => {
      return {
        ...prevPurchasemgnemt,
        points: prevPurchasemgnemt.points.map((point, pointIndex) => {
          if (pointIndex === index) {
            if (type === "checkbox") {
              return { ...point, [name]: checked }
            } else {
              return { ...point, [name]: value }
            }
          } else {
            return point
          }
        }),
      }
    })
  }

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
    e.preventDefault()
    confirmDeleteToast(async () => {
      try {

        const response = await axiosInstance.delete(`/mastersheet/tanklorry/${id}`)
        navigate("/mastersheet")
        toast.success("Purchase management sheet deleted successfully!")

      } catch (error) {
        toast.warn("Error deleting purchase management sheet!")
      }
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const data = {
      ...lorrymgnemt,
    }
    try {
      const response = await axiosInstance.put(`/mastersheet/tanklorry/${id}`, data)
      toast.success("Lubricant management sheet updated successfully!")
    } catch (error) {
      toast.warning("Error updating purchase management sheet!")
    }
  }

  const handleItemChange = (e, index) => {
    const { value } = e.target
    setLorrymagnmnet((prevPurchasemgnemt) => ({
      ...prevPurchasemgnemt,
      points: prevPurchasemgnemt.points.map((point, pointIndex) =>
        pointIndex === index ? { ...point, itemToCheck: value } : point,
      ),
    }))
  }

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
    )
  }

  if (!lorrymgnemt) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No report found...</p>
      </div>
    )
  }

  const handleDate = () => {
    const dateObject = new Date(date)
    const day = dateObject.getDate().toString().padStart(2, "0")
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0")
    const year = dateObject.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-center  text-4xl p-4 font-bold">TANK LORRY MANAGEMENT</h1>
      <form onSubmit={handleSave}>
        <div className="flex justify-evenly items-center p-4">
          <Link to={"/mastersheet"}>
            <div className="">
              <img src={previousImage || "/placeholder.svg"} width={50} alt="Back" />
            </div>
          </Link>
          <div className="col-span-2 text-xl">
            <strong>
              <input className="bg-transparent" value={handleDate()} readOnly />
            </strong>
          </div>
          <div>
            <img
              src={binImage}
              onClick={handleDelete}
              width={50}
              height={50}
              className=" "
              alt="Bin"
            />
          </div>
          <div>
            <button type="submit" className='bg-transparent'>
              <img src={saveImage || "/placeholder.svg"} width={50} alt="Save" />
            </button>{" "}
          </div>
        </div>
        <div className="table-container">
          <table className="">
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
              {lorrymgnemt.points.map((item, index) => (
                <tr key={index}>
                  <td className='p-2 border'>
                    {index + 1}</td>
                  <td className='p-2 border'>
                    <input
                      type="text"
                      name="itemToCheck"
                      value={item.itemToCheck}
                      onChange={(e) => handleItemChange(e, index)}
                    />
                  </td>
                  <td className='p-2 border'>
                    <input
                      type="checkbox"
                      name="ok"
                      checked={item.ok === true || item.ok === "Yes" || item.ok === "true"}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td className='p-2 border'>
                    <input
                      type="text"
                      name="responsible"
                      value={item.responsible}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td className='p-2 border'>
                    <input
                      type="text"
                      name="defectPerson"
                      value={item.defectPerson}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td className='p-2 border'>
                    <input
                      type="text"
                      name="defectDelaysDays"
                      value={item.defectDelaysDays}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td className='p-2 border'>
                    <input
                      type="text"
                      name="deadline"
                      value={item.deadline}
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
  )
}

export default tanklorryupdate;