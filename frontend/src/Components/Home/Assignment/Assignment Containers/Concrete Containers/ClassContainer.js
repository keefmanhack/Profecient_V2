import React from 'react';
import AbsractContainer from '../AbsractContainer';

function ClassContainer(props){
    return(
        <AbsractContainer 
            groups={groupAllByClass(props.assignments)}
        />
    )
}

function groupAllByClass(assignments){
    //data looks like [{heading: 'some text', assignments: []}]
    assignments = assignments.sort((a, b) => a.dueDate-b.dueDate);
    let groups = [];
    const headings =[];
    for(let i =0; i<assignments.length; i++){
        const heading = assignments[i].parentClass.name;
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

export default ClassContainer;