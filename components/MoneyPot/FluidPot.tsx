import React, { useEffect } from "react";

export default function FluidPot({ pot, total, level }) {

    useEffect(() => {
        const currentLevel = document.documentElement.style.getPropertyValue('--fillPercentage');
        const el = document.getElementById('liquid-pot');
        const newOne = el.cloneNode(true);
        document.documentElement.style.setProperty('--fillPercentageCurrentLevel', currentLevel);
        document.documentElement.style.setProperty('--fillPercentage', level);
        el.parentNode.replaceChild(newOne, el);
    }, [level]);

    return(
        <>
            <div className="md:mt-12">{pot.goal && pot.goal}</div>
            <div className="banner mx-auto w-[50px] h-full md:w-[150px] md:h-[150px] md:rounded-full">
                <div  id="liquid-pot" className="fill">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" enableBackground="new 0 0 300 300">
                    <path fill="#04ACFF" id="waveShape" d="M300,300V2.5c0,0-0.6-0.1-1.1-0.1c0,0-25.5-2.3-40.5-2.4c-15,0-40.6,2.4-40.6,2.4
                    c-12.3,1.1-30.3,1.8-31.9,1.9c-2-0.1-19.7-0.8-32-1.9c0,0-25.8-2.3-40.8-2.4c-15,0-40.8,2.4-40.8,2.4c-12.3,1.1-30.4,1.8-32,1.9
                    c-2-0.1-20-0.8-32.2-1.9c0,0-3.1-0.3-8.1-0.7V300H300z"/>
                    </svg>
                </div>
                <p className="text-4xl total-value left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 absolute">{total}</p>
            </div>
        </>
    );
}