import React, { useState } from 'react';

import SimpleContainer from '../SimpleContainer/SimpleContainer';

import './index.css';
function SelectableContainer(props){
    const [isHovering, setIsHovering] = useState(false);
    return(
        <SimpleContainer
            name={props.classData.name}
            instructor={props.classData.instructor}
            location={props.classData.location}
            daysOfWeek={props.classData.daysOfWeek}
            time={props.classData.time}
            classID={props.classData._id}
            classList={'light-green-bc selectable'}
            style={
                props.selected || isHovering ? 
                    selectedStyle
                : null
            }
            handleClick={() => props.setSelected(props.classData._id)}
            handleMouseEnter={() => setIsHovering(true)}
            handleMouseLeave={() => setIsHovering(false)}
        />
    )
}

const selectedStyle ={
    border: '3px solid #007bff',
}

export default SelectableContainer;