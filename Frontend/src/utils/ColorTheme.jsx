import React, { useState, useEffect } from 'react'
import { FiSun } from "react-icons/fi";
import { RiMoonFill } from "react-icons/ri";

const ColorTheme = () => {
    const [dark, setDark] = useState(false)

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark)
    }, [dark])
    return (
        <button onClick={() => setDark(!dark)} className='text-green-700'>
            {dark ? <FiSun size={24} /> : <RiMoonFill size={24} />}
        </button>
    )
}

export default ColorTheme