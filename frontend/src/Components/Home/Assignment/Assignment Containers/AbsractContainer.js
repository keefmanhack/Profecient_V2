import React from 'react';

import Assignment from '../Assignment';

function AbsractContainer(props){
    const groups = props.groups.map((data, index) => 
        <Group heading={data.heading} assignments={data.assignments} key={index}/>
    )
    return (
        <div className='ass-cont'>
            {groups}
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
            <hr/>
            {assignments}
        </div>
    )
}

export default AbsractContainer;