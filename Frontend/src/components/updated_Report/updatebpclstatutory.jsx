import axiosInstance from '../Dashboard/axiosInstance'
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import binImage from "/bin.png"
import previousImage from "/previous.png"
import saveImage from "/save.png"

const updatesalemanagemnet = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [purchasemgnemt, setPurchasemagnmnet] = useState({
    date: "",
    points: [],
  })
  const navigate = useNavigate()
  const [date, setDate] = useState("")
  useEffect(() => {
    const fetchPumpSheetData = async () => {
      try {
        const response = await axiosInstance.get(`/mastersheet/bpcl&statutory/${id}`)
        setPurchasemagnmnet(response.data)
        setDate(response.data.dat2)
        setLoading(false)
      } catch (err) {
        alert("Fetch nhh hora")
      } finally {
        setLoading(false)
      }
    }
    fetchPumpSheetData()
  }, [id])

  const handleInputChnge = (e, index) => {
    const { name, value, type, checked } = e.target
    setPurchasemagnmnet((prevPurchasemgnemt) => {
      return {
        ...prevPurchasemgnemt,
        points: prevPurchasemgnemt.points.map((point, pointIndex) => {
          if (pointIndex === index) {
            if (type === "checkbox") {
              return { ...point, [name]: checked  }
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

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      if (window.confirm("Are you sure you want to delete this purchase management sheet?")) {
        const response = await axiosInstance.delete(`/mastersheet/bpcl&statutory/${id}`)
        navigate("/mastersheet")
        alert("Purchase management sheet deleted successfully!")
      }
    } catch (error) {
      alert("Error deleting purchase management sheet!")
    }
  }
  const handleSave = async (e) => {
    e.preventDefault()
    const data = {
      ...purchasemgnemt,
    }
    try {
      const response = await axiosInstance.put(`/mastersheet/bpcl&statutory/${id}`, data)
      alert("Purchase management sheet updated successfully!")
    } catch (error) {
      alert("Error updating purchase management sheet!")
    }
  }

  const handleItemChange = (e, index) => {
    const { value } = e.target
    setPurchasemagnmnet((prevPurchasemgnemt) => ({
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

  if (!purchasemgnemt) {
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
    <>
      <div>
        <h1 className="text-center  text-2xl p-4 font-bold">BPCL & STATUTORY MANAGEMENT</h1>
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
                src={binImage || "/placeholder.svg"}
                onClick={handleDelete}
                width={50}
                height={50}
                className=" "
                alt="Bin"
              />
            </div>
            <div>
              <button type="submit">
                <img src={saveImage || "/placeholder.svg"} width={50} alt="Save" />
              </button>{" "}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Point</th>
                <th>Item to Check</th>
                <th>Ok</th>
                <th>Responsible</th>
                <th>Defect Person</th>
                <th>Defect Delays Days</th>
                <th>Deadline</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {purchasemgnemt.points.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      name="itemToCheck"
                      value={item.itemToCheck}
                      onChange={(e) => handleItemChange(e, index)}
                    />
                  </td>
                  <td>
                  <input
                      type="checkbox"
                      name="ok"
                      checked={item.ok === true || item.ok === "Yes" || item.ok === "true"}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="responsible"
                      value={item.responsible}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="defectPerson"
                      value={item.defectPerson}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="defectDelaysDays"
                      value={item.defectDelaysDays}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="deadline"
                      value={item.deadline}
                      onChange={(e) => handleInputChnge(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="comment"
                      value={item.comment}
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
  )
}

export default updatesalemanagemnet

