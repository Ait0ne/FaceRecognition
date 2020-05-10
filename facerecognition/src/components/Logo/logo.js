import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';


const Logo = () => {
    return(
        <div className='flex ma4 mt0 items-center justify-start'>
            <Tilt className="flex shadow-2 Tilt justify-center pointer" options={{ max : 10, perspective:30, reset: false }}  >
                <div className="Tilt-inner white">MyLogo</div>
            </Tilt>
        </div>
    )
}

export default Logo;