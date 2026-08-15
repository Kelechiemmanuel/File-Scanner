import React, { useState, useEffect } from 'react'
import { FiSun } from "react-icons/fi";
import { FaCircleHalfStroke } from "react-icons/fa6";

const ColorTheme = () => {
    const [dark, setDark] = useState(false)

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark)
    }, [dark])
    return (
        <button onClick={() => setDark(!dark)} className='text-green-700'>
            {dark ? <FiSun size={24} /> : <FaCircleHalfStroke size={24} />}
        </button>
    )
}

export default ColorTheme