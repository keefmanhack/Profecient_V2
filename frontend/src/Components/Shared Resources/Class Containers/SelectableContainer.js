import React from 'react';

import SimpleContainer from './SimpleContainer';

function SelectableContainer(props){
    return(
        <SimpleContainer
            name={props.name}
            instructor={props.instructor}
            location={props.location}
            daysOfWeek={props.daysOfWeek}
            time={props.time}
            classID={props.classID}
            style={
                props.selected ? 
                    {border: '3px solid blue'}
                : null
            }
            handleClick={() => props.setSelected(props.classID)}
        />
    )
}

export default SelectableContainer;