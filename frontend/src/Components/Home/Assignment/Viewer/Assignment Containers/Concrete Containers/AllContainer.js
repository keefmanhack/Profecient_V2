import React from 'react';
import moment from 'moment';

import dayHeading from './Heading Functions/DayHeading';
import AbsractContainer from '../AbsractContainer';

function AllContainer(props){
    return(
        <AbsractContainer
            edit={(classID, assID) => props.edit(classID, assID)}
            delete={(classID, assID) => props.delete(classID, assID)}
            setCompleted={(id, b) => props.setCompleted(id, b)}
            groups={groupAllByDate(props.assignments)}
        />
    )
}

function groupAllByDate(assignments){
    //data looks like [{heading: 'some text', assignments: []}]
    // assignments = assignments.sort((a, b) => a.dueDate-b.dueDate);
    let groups = [];
    const headings =[];
    for(let i =0; i<assignments.length; i++){
        const heading = dayHeading(assignments[i].assignment.dueDate);
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

export default AllContainer;