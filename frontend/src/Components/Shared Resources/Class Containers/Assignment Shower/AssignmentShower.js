import React, { useState, useEffect } from 'react';

import AssignmentRequests from '../../../../APIRequests/Assignment';

import SimpleAssignment from '../../Assignment Types/SimpleAssignment';

import {FadeDownUpHandleState, FadeInOut} from '../../Effects/CustomTransition';
import MessageFlasher from '../../MessageFlasher';
import AbsractError from '../../Messages/Error Messages/AbsractError';
import Loader from '../../Effects/Loader/loader';

function AssignmentShower(props){
    const [showAsses, setShowAsses] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const dropDownDis = <i className={showAsses ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}></i> 
    return(
        <React.Fragment>
            <MessageFlasher condition={errMsg!==''} resetter={() => setErrMsg('')}>
                <AbsractError errorMessage={errMsg}/>
            </MessageFlasher>
            <button className='see-assign' onClick={() => {const t = showAsses; setShowAsses(!t)}}>
                {dropDownDis} {showAsses ? 'Close' : 'See'} Assignments 
            </button>
            <div style={{position: 'relative', overflow: 'hidden'}}>
                <FadeDownUpHandleState condition={showAsses}>
                    <AssignContainer 
                        setErrMsg={(msg) => setErrMsg(msg)} 
                        assignmentIDs={props.assignmentIDs} 
                        userID={props.userID}
                    />
                </FadeDownUpHandleState>
            </div>
        </React.Fragment>
    )
}

function AssignContainer(props){
    const assReq = new AssignmentRequests(props.userID);
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
        getAssignments();
    }, [])
    
    const getAssignments = async () => {
        setIsLoading(true);
        const res = await assReq.getMultiple(props.assignmentIDs);
        setIsLoading(false);
        if(res.success){
            setAssignments(res.assignments);
        }else{
            props.setErrMsg(res.error);
        }
    }
    let completed = [], unCompleted = [];
    for(let i =0; i<assignments.length; i++){
        const a = assignments[i];
        const ass = <SimpleAssignment
                        name={a.name}
                        dueDate={a.dueDate}
                        dueTime={a.dueTime}
                        description={a.description}
                        key={a._id}
                    />
        a.complete ? completed.push(ass) : unCompleted.push(ass);
    }

	return(
		<div className='assign-container'>
            {isLoading ? <Loader/> : null}

            <div>
                <h5>UnCompleted</h5>
                <hr/>
                {unCompleted}
                <h5 style={{marginTop: 10}}>Completed</h5>
                <hr/>
                {completed}
            </div>
		</div>
	);
}

export default AssignmentShower;