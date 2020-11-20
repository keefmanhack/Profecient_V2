import React, { useState } from 'react';

import './index.css';
function Toggler(props){
    const [isOn, setIsOn] = useState(props.defaultToggle);
    const handleChange = () => {
        const t = !isOn
        setIsOn(t);
        props.toggled(t);
    }
    return (
        <div className='toggler'>
            <span className='white-c name'>{props.name}</span>
            <label class="switch">
                <input checked={isOn} onChange={() => handleChange()} type="checkbox"/>
                <span class="slider round"></span>
            </label>
        </div>

    )
}

export default Toggler;