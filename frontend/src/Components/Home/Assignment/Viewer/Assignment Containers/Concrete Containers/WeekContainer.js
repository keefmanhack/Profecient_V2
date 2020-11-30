import React from 'react';
import moment from 'moment';

import weekHeading from './Heading Functions/weekHeading';
import AbsractContainer from '../AbsractContainer';

function WeekContainer(props){
    return(
        <AbsractContainer
            edit={(classID, assID) => props.edit(classID, assID)}
            delete={(classID, assID) => props.delete(classID, assID)}
            setCompleted={(id, b) => props.setCompleted(id, b)}
            groups={groupWeekByDate(props.assignments)}
        />
    )
}

function groupWeekByDate(assignments){
    const now = moment();
    let assThisWeek = [];
    for(let i =0; i<assignments.length; i++){
        const d = moment(assignments[i].assignment.dueDate);
        if(d.diff(now, 'days') <= 7){
            assThisWeek.push(assignments[i]);
        }
    }
    
    let groups = [];
    const headings =[];
    for(let i =0; i<assThisWeek.length; i++){
        const heading = weekHeading(assThisWeek[i].assignment.dueDate);
        const index = headings.indexOf(heading);
        if(index === -1){
            headings.push(heading);
            groups.push({heading: heading, assignments: [assThisWeek[i]]});
        }else{
            groups[index].assignments.push(assThisWeek[i]);
        }
    }
    return groups;
}

export default WeekContainer;