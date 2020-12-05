import React from 'react';

import SimpleContainer from '../SimpleContainer/SimpleContainer';

import AssignmentShower from './Assignment Shower/AssignmentShower';

import './index.css';

function AssignmentContainer(props){
    return(
        <SimpleContainer
            name={props.name}
            instructor={props.instructor}
            location={props.location}
            daysOfWeek={props.daysOfWeek}
            time={props.time}
            classID={props.classID}
            classList={props.classList} 
            assignmentContainer={
                <AssignmentShower 
                    assignmentIDs={props.assignmentIDs} 
                    userID={props.userID}
                />
            }
            interaction={props.interaction}
        />
    )
}

export default AssignmentContainer;