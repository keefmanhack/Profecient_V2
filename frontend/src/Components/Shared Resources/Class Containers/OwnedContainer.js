import React from 'react';
import AssignmentContainer from './Assignment Container/AssignmentContainer';

function OwnedContainer(props){
    return(
        <AssignmentContainer
            name={props.classData.name}
            instructor={props.classData.instructor}
            location={props.classData.location}
            daysOfWeek={props.classData.daysOfWeek}
            time={props.classData.time}
            classList={'light-green-bc'}
            currentUserID={props.currentUserID}    
            assignmentIDs={props.assignmentIDs} 
            currentUserID={props.currentUserID}
            classList={'light-green-bc'}
            interaction={
                <button 
                    className='edit-connection white-bc blue-c' 
                    onClick={() => props.handleClick()}>Edit Connections</button>
            }
        />
    )
}

export default OwnedContainer;