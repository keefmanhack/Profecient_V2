import React from 'react';
import moment from 'moment';

import AbsractContainer from '../AbsractContainer';

function AllContainer(props){
    return(
        <AbsractContainer 
            groups={groupAllByDate(props.assignments)}
        />
    )
}

function groupAllByDate(assignments){
    //data looks like [{heading: 'some text', assignments: []}]
    assignments = assignments.sort((a, b) => a.dueDate-b.dueDate);
    let groups = [];
    const headings =[];
    for(let i =0; i<assignments.length; i++){
        const heading = createHeading(assignments[i].dueDate);
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
    const d = moment(date);
    const now = moment();
    const diff = now.diff(d, 'days');
    if(diff < 0){
        return 'Overdue';
    }else if(diff === 0){
        return 'Today';
    }else if(diff === 1){
        return 'Tomorrow';
    }else{
        return d.format('MMM DD YY');
    }
}

export default AllContainer;