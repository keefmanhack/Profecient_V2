import React from 'react';
import AssignmentContainer from './AssignmentContainer';

function OwnedContainer(props){
    return(
        <AssignmentContainer
            name={props.classData.name}
            instructor={props.classData.instructor}
            location={props.classData.location}
            daysOfWeek={props.classData.daysOfWeek}
            time={props.classData.time}
            // classID={props.classData._id}
            currentUserID={props.currentUserID}    
            assignmentIDs={props.assignmentIDs} 
            currentUserID={props.currentUserID}
            interaction={<button onClick={() => props.handleClick()}>Edit Connections</button>}
        />
    )
}

export default OwnedContainer;