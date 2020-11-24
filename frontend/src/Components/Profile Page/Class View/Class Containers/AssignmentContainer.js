import React from 'react';
import SimpleContainer from './SimpleContainer';

function AssignmentContainer(props){
    return(
        <SimpleContainer
            name={props.name}
            instructor={props.instructor}
            location={props.location}
            daysOfWeek={props.daysOfWeek}
            time={props.time}
            classID={props.classID}
            currentUserID={props.currentUserID}    
            assignmentContainer={
                <AssignmentContainer 
                    assignmentIDs={props.assignmentIDs} 
                    currentUserID={props.currentUserID}
                />
            }
        />
    )
}

export default AssignmentContainer;