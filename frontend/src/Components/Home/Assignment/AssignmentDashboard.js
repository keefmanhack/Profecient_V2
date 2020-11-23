import React, {useState, useEffect} from 'react';
import moment from 'moment';

//concrete components
import NewAssignmentForm from './Assignment Forms/NewAssignmentForm';
import AssignmentViewer from './Viewer/AssignmentViewer';
//Effects
import {FadeInOutHandleState, FadeDownUpHandleState} from '../../Shared Resources/Effects/CustomTransition';

import AbsractError from '../../Shared Resources/Messages/Error Messages/AbsractError';
import MessageFlasher  from '../../Shared Resources/MessageFlasher';

import './index.css';

function AssignmentDashboard(props){
	// const assReq = new AssignmentRequests(props.currentUserID);
	const [shouldShowNewForm, setShouldShowNewForm]       = useState(false);
	const [errMsg, setErrMsg]						      = useState('');
	
	return(
		<React.Fragment>
			<MessageFlasher condition={errMsg!==''} resetter={() => setErrMsg('')} animation={FadeDownUpHandleState}>
				<AbsractError errorMessage={errMsg} />
			</MessageFlasher>
			<div className='assignment-dashboard sans-font' style={props.style}>
				<h1 className='gray-c '>Assignments</h1>
				<button onClick={() => setShouldShowNewForm(true)} className='add green-bc'>Add</button>
				<AssignmentViewer reload={shouldShowNewForm} currentUserID={props.currentUserID}/>
			</div>
			<FadeInOutHandleState condition={shouldShowNewForm}>
				<NewAssignmentForm 
					hideForm={() => setShouldShowNewForm(false)}
					currentUserID={props.currentUserID}
				/>
			</FadeInOutHandleState>
		</React.Fragment>
	);
}

export default AssignmentDashboard;