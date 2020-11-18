import React, { useEffect, useState } from 'react';
import moment from 'moment';

import AssignmentRequests from '../../../../APIRequests/Assignment';

import './index.css';

function FullAssList(props){
    const ag = new AssignmentGrouper()
    const assReq = new AssignmentRequests(props.userID);
    const [assignments, setAssignments] = useState(null);
    const [isClassSorted, setIsClassSorted] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() =>{
        getAssignments();
    }, [])

    const getAssignments = async () => {
        const res = await assReq.getAll();
        res.success ? setAssignments(res.assignments) : setErr(res.error);
    }
    
    let groupedAssignments;
    if(isClassSorted){
        groupedAssignments = ag.group(assignments, new ClassStrategy());
    }else{
        groupedAssignments = ag.group(assignments, new DateStrategy());
    }
    const groups = groupedAssignments.map((data, index) =>
        <Group reload={() => await getAssignments()} isClassSorted={isClassSorted} data={data}/>
    )
    return(
        <div className='fixed-cont'>
            <div className='full-a-list mont-font'>
                <div className='header'>
                    <h1 className='white-c'>Assignments</h1>
                    <button className='red-c'>Exit</button>
                    <hr/>
                </div>
                <div className='list'>
                    {groupedAssignments}
                </div>
            </div>
            
        </div>
    )
}

function Group(props){
    const assignments = props.data.assignments.map((data, index) => 
        isClassSorted ? 
            <AssignmentShowDueDate data={data} />
        :
            <AssignmentShowClass />
    )
    return(
        <div className='group'>
            <h1>{props.data.heading}</h1>
            <hr/>
            {assignments}
        </div>
    )
}

class AssignmentGrouper{
    constructor(){
        this.groups = [];
    }

    group = (assignments, groupStrategy) =>{
        if(!assignments){
            return null;
        }

        groupStrategy.group(assignments);
    }
}

class ClassStrategy{
    constructor(){
        this.groups = [];
    }

    group = assignments => {
        let groups = [];
        for(let i =0 ; i< assignments.length;i++){
            let g = []
            for(let j =i; j<assignments.length; j++){
                if(assignments[i].className === assignments[j].className){
                    g.push(assignments[j]);
                }
                groups.push(g);
                g=[];
            }
        }

        for(let i =0; i< groups.length; i++){
            this.groups.push({heading: groups[i][0].className, assignments: groups[i]});
        }
    }
}

class DateStrategy{
    constructor(){
        this.groups = [];
    }
    group = assignments => {
        //sort by due data
        //loop through add to this groups
        const sortedAsses = assignments.sort((a, b) => a.dueDate - b.dueDate);
        let groups = [];
        for(let i =0 ; i< sortedAsses.length;i++){
            let g = []
            for(let j =i; j<sortedAsses.length; j++){
                if(this.sameDay(sortedAsses[i], sortedAsses[j])){
                    g.push(sortedAsses[j]);
                }
                groups.push(g);
                g=[];
            }
        }

        for(let i =0; i< groups.length; i++){
            this.groups.push({heading: this.formatHeading(this.groups[i][0].dueDate), assignments: groups[i]});
        }
    }

    formatHeading = date => {
        const d = moment(date);
        const rn = moment();
        if(rn.diff(d, 'days') < 0){
            return 'Overdue';
        }else if(this.sameDay(rn , d)){
            return 'Today';
        }else{
            return d.format("MMM Do YY");
        }
    }

    sameDay = (date1, date2) => {
        return moment(date1).diff(moment(date2), 'days') === 0;
    }
}

export default FullAssList;