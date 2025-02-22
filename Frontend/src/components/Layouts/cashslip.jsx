import React from 'react'
import { Link } from 'react-router-dom'
import previousImage from '/public/previous.png'

const cashslip = () => {
    return (
        <>
            <div></div>
            <div className="fixed bottom-6 left-6 p-4  rounded-full ">
                <Link to="/dashboard">
                    <img src={previousImage} alt="Back" width={50} className="rounded-full" />
                </Link>
            </div>
        </>
    )
}

export default cashslip
