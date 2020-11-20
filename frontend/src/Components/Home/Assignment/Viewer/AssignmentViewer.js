import React, {useState, useEffect} from 'react';

//API
import AssignmentRequests from '../../../../APIRequests/Assignment';

//Concrete
import SortSelector from './Sort Selector/SortSelector';
import ClassLegend from './Class Legend/ClassLegend';
import CompletedTogler from './CompletedTogler';

//Effects/Messaging
import MessageFlasher from '../../../Shared Resources/MessageFlasher';
import {FadeDownUpHandleState} from '../../../Shared Resources/Effects/CustomTransition';
import AbsractError from '../../../Shared Resources/Messages/Error Messages/AbsractError';
import Loader from '../../../Shared Resources/Effects/Loader/loader';

import './AssignmentViewer.css';
function AssignmentViewer(props){
	const assReq = new AssignmentRequests(props.currentUserID);
	const [assignments, setAssignments]	= useState([]);
	const [sortType, setSortType] 		= useState(SortSelector.getInitial());
	const [wasCompleted, setWasCompleted] = useState(CompletedTogler.getInitial());
	const [errMsg, setErrMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getAssignments();
	}, [wasCompleted]);

	const getAssignments = async () => {
		setIsLoading(true);
		const res = wasCompleted ? await assReq.completed() : await assReq.unCompleted();
		if(res.success){
			setAssignments(res.assignments);
		}else{
			setErrMsg(res.error);
		}
		setIsLoading(false);
	}

	const setCompleted = async (id, isComplete) =>{
		console.log(id);
		console.log(isComplete);
	}

	const edit = async (classID, assID) =>{
		// console.log(id);
	}

	const remove = async (classID, assID) =>{
		const res = await assReq.delete(classID, assID);
		if(res.success){
			getAssignments();
		}else{
			setErrMsg(res.error);
		}
	}

	const AssignmentContainer = sortType.object;
	return(
		<React.Fragment>
			<MessageFlasher condition={errMsg!==''} resetter={() => setErrMsg('')} animation={FadeDownUpHandleState}>
				<AbsractError errorMessage={errMsg} />
			</MessageFlasher>
			<div className='ass-viewer'>
				<ViewSetter 
					setSortType={(t) => setSortType(t)}
					currentUserID={props.currentUserID}
					setWasCompleted={(b) => setWasCompleted(b)}
				/>
				<ClassLegend currentUserID={props.currentUserID}/>
				<hr/>
				<div style={{borderRadius: 3, position: 'relative', minHeight:30}}>
					{isLoading ? <Loader/> : null}
					<AssignmentContainer  
						edit={(id) => edit(id)}
            			delete={(classID, assID) => remove(classID, assID)}
						setCompleted={(id, b) => setCompleted(id, b)} 
						assignments={assignments}
					/>
				</div>
			</div>
		</React.Fragment>
	)
}

function ViewSetter(props){
	return(
		<div className='view-setter'>
			<div className='row'>
				<div className='col-auto'>
					<SortSelector setSortType={(type) => props.setSortType(type)}/>
				</div>
				<div className='col-auto'>
					<CompletedTogler 
						toggled={(b) => props.setWasCompleted(b)}
					/>
				</div>
			</div>
		</div>

	)
}

export default AssignmentViewer;
