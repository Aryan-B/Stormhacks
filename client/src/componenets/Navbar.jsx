
import React from 'react';
import '../App.css'

const Navbar = (prop) => {

    return (
        <header className="sticky top-0 bg-[#ACB1D6] z-40">
            <nav className="flex flex-row items-center justify-between m-7 font-bold">
                <h1 className="text-white text-shadow" >Q-Genius</h1>
                <ul className="flex flex-row gap-4 text-[20px] text-white">
                    <a onClick={() => prop.handleSequence(3)}><li>SEARCH</li></a>
                    <a onClick={() => prop.handleSequence(0)}><li>UPLOAD</li></a>
                    <a onClick={() => prop.handleSequence(0)}><li>ABOUT</li></a>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;