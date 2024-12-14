import React from 'react'
import noteBookImg from '../assets/images/notebook.jpg'
import '../CSS/AboutUs.css'
import Navbar from '../Components/Navbar'

export default function AboutUs() {
    return (
        <div>
            <Navbar />
            <div className='aboutUs container-sm'>
                <div>
                    <h2>About Us</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>

                <div className='aboutUs-image'>
                    <img src={noteBookImg} alt="AboutUs" className="img-fluid" />

                </div>
            </div>

        </div>
    )
}
