import React from 'react';
import moment from 'moment';

function SimpleContainer(props){
    return(
        <div className='class-container'>
            <React.Fragment>
            {props.interaction}
            </React.Fragment>
            
            <h1>{props.name}</h1>
            <h2>{props.instructor}</h2>
            <h3>{props.location}</h3>
            <DayList daysOfWeek={props.daysOfWeek}/>
            <ToFromTime start={props.time.start} end={props.time.end}/>
            {props.assignmentContainer}
        </div>
    )
}

function ToFromTime(props){
    const startTime = moment(props.start).format('h:mm a');
	const endTime = moment(props.end).format('h:mm a');
    return(
        <h4>{startTime} - {endTime}</h4>
    )
}


const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
function DayList(props){
    const daySpans = days.map((day, index)=>
        <span style={props.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
    );
    return <h4 style={{marginBottom: 0}}>{daySpans}</h4>;
}

export default SimpleContainer