import React from 'react';
import { FadeInOut, FadeInOutHandleState, FadeRightHandleState } from '../../../../Shared Resources/Effects/CustomTransition';

import Assignment from '../../Assignment';

import './index.css';
function AbsractContainer(props){
    const groups = props.groups.map((data, index) => 
        <Group heading={data.heading} assignments={data.assignments} key={index}/>
    )
    return (
        <div className='ass-cont'>
            {groups}
            {groups.length===0 ? 
                <div className='light-grey-bc animate__animated animate__faster animate__fadeIn' style={{textAlign: 'center', borderRadius:5}}>
                   <p className='white-c'>Your assignments display here</p>
                </div>
            :
                null
            }
        </div>
    )
}

function Group(props){
    const assignments = props.assignments.map((data, index) => 
        <Assignment 
            name={data.assignment.name} 
            classColor={data.parentClass.color} 
            description={data.assignment.description}  
            dueDate={data.assignment.dueDate}
            dueTime={data.assignment.dueTime}
            key={data.assignment._id}
        />
    )
    return(
        <div className='group'>
            <h4>{props.heading}</h4>
            {assignments}
        </div>
    )
}

export default AbsractContainer;