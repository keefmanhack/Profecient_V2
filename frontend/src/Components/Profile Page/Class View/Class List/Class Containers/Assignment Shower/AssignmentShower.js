import React, { useState, useEffect } from 'react';

import AssignmentRequests from '../../../../../../APIRequests/Assignment';

import {FadeDownUpHandleState} from '../../../../../Shared Resources/Effects/CustomTransition';
import MessageFlasher from '../../../../../Shared Resources/MessageFlasher';
import AbsractError from '../../../../../Shared Resources/Messages/Error Messages/AbsractError';

function AssignmentShower(props){
    const [showAsses, setShowAsses] = useState(false);

    const dropDownDis = <i className={"fas fa-chevron-" + showAsses ? 'up' : 'down'}></i> 
    return(
        <React.Fragment>
            <button className='see-assign' onClick={() => {const t = showAsses; setShowAsses(!t)}}>
                {dropDownDis} {showAsses ? 'Close' : 'See'} Assignments 
            </button>
            <div style={{position: 'relative'}}>
                <FadeDownUpHandleState condition={showAsses}>
                    <AssignContainer classID={props.classID} userID={props.otherUserID}/>
                </FadeDownUpHandleState>
            </div>
        </React.Fragment>
    )
}

function AssignContainer(props){
    const assReq = new AssignmentRequests(props.userID);
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

	useEffect(() => {
		getAssignments();
    }, [])
    
    const getAssignments = async () => {
        setIsLoading(true);
        const res = await assReq.findMultple(props.assignmentIDs);
        setIsLoading(false);
        if(res.success){
            setAssignments(res.assignments);
        }else{
            setErrMsg(res.error);
        }
    }
    let completed, unCompleted = [];
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
            <MessageFlasher condition={errMsg!==''} resetter={() => setErrMsg('')}>
                <AbsractError errorMessage={errMsg}/>
            </MessageFlasher>

			<h5>UnCompleted</h5>
			<hr/>
			{unCompleted}
			<h5 style={{marginTop: 10}}>Completed</h5>
			<hr/>
			{completed}
		</div>
	);
}

export default AssignmentShower;