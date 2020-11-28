import React from 'react';
import AssignmentContainer from './AssignmentContainer';

function OwnedContainer(props){
    return(
        <AssignmentContainer
            name={props.name}
            instructor={props.instructor}
            location={props.location}
            daysOfWeek={props.daysOfWeek}
            time={props.time}
            classID={props.classID}
            currentUserID={props.currentUserID}    
            assignmentIDs={props.assignmentIDs} 
            currentUserID={props.currentUserID}
            interaction={<button onClick={() => props.handleClick()}>Edit Connections</button>}
        />
    )
}

export default OwnedContainer;