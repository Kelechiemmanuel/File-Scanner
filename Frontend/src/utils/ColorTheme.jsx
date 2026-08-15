import React, { useState, useEffect } from 'react'
import { FiSun, FiMoon } from "react-icons/fi";

const ColorTheme = () => {
    const [dark, setDark] = useState(false)

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark)
    }, [dark])
    return (
        <button onClick={() => setDark(!dark)} className='text-green-700'>
            {dark ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>
    )
}

export default ColorTheme