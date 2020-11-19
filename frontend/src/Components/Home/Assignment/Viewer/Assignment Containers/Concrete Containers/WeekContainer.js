import React from 'react';
import moment from 'moment';

import AbsractContainer from '../AbsractContainer';

function WeekContainer(props){
    return(
        <AbsractContainer 
            groups={groupWeekByDate(props.assignments)}
        />
    )
}

function groupWeekByDate(assignments){
    //data looks like [{heading: 'some text', assignments: []}]
    // assignments = assignments.sort((a, b) => a.dueDate-b.dueDate);
    const now = moment();
    for(let i =0; i<assignments.length; i++){
        const d = assignments[i].assignment.dueDate;
        if(now.diff(d, 'days') > 7){
            assignments = assignments.splice(i, 1);
        }
    }
    let groups = [];
    const headings =[];
    for(let i =0; i<assignments.length; i++){
        const heading = createHeading(assignments[i].assignment.dueDate);
        const index = headings.indexOf(heading);
        if(index === -1){
            headings.push(heading);
            groups.push({heading: heading, assignments: [assignments[i]]});
        }else{
            groups[index].assignments.push(assignments[i]);
        }
    }
    return groups;
}

function createHeading(date){
    console.log(date);
    const d = moment(date);
    const now = moment();
    const diff = d.diff(now, 'days');
    
    if(diff < 0){
        return 'Overdue';
    }else if(diff === 0){
        return 'Today';
    }else if(diff === 1){
        return 'Tomorrow';
    }else{
        return d.format('dddd');
    }
}

export default WeekContainer;