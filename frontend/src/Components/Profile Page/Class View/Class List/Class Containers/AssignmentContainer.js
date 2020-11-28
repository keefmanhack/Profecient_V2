import React from 'react';

import SimpleContainer from './SimpleContainer';

import AssignmentShower from './Assignment Shower/AssignmentShower';

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
                <AssignmentShower 
                    assignmentIDs={props.assignmentIDs} 
                    currentUserID={props.currentUserID}
                />
            }
            interaction={props.interaction}
        />
    )
}

export default AssignmentContainer;