import React, { useState } from 'react';

import './index.css';
function Toggler(props){
    const [isOn, setIsOn] = useState(props.defaultToggle ? props.defaultToggle : false);
    const handleChange = () => {
        const t = isOn
        setIsOn(!t);
        props.toggled(isOn);
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