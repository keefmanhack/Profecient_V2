import React, {useState, useEffect} from 'react';

//API
import AssignmentRequests from '../../../../APIRequests/Assignment';

//Concrete
import SortSelector from './Sort Selector/SortSelector';
import ClassLegend from './Class Legend/ClassLegend';
import CompletedTogler from './CompletedTogler';
import UpdateAssignmentForm from '../Assignment Forms/UpdateAssignmentForm';

//Effects/Messaging
import MessageFlasher from '../../../Shared Resources/MessageFlasher';
import {FadeInOutHandleState} from '../../../Shared Resources/Effects/CustomTransition';
import AbsractError from '../../../Shared Resources/Messages/Error Messages/AbsractError';
import Loader from '../../../Shared Resources/Effects/Loader/loader';

import './AssignmentViewer.css';
function AssignmentViewer(props){
	const assReq = new AssignmentRequests(props.currentUserID);
	const [updateForm, setUpdateForm] = useState(null);
	const [assignments, setAssignments]	= useState([]);
	const [sortType, setSortType] 		= useState(SortSelector.getInitial());
	const [wasCompleted, setWasCompleted] = useState(CompletedTogler.getInitial());
	const [errMsg, setErrMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [shouldShowUpdateForm, setShouldShowUpdateForm] = useState(false);

	useEffect(() => {
		getAssignments();
	}, [wasCompleted, props.reload, shouldShowUpdateForm]);

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
		const res = await assReq.toggleCompleted(id, isComplete);
		res.success ? getAssignments() : setErrMsg(res.error);
	}

	const edit = async (classID, assID) =>{
		try{
			const data = findAssignment(assignments, assID);
			const t = <UpdateAssignmentForm 
							selectedID={classID} 
							dueDate={data.assignment.dueDate}
							name={data.assignment.name}
							description={data.assignment.description}
							dueTime={data.assignment.dueTime}
							assignmentID={data.assignment._id}
							hideForm={() => setShouldShowUpdateForm(false)}
							currentUserID={props.currentUserID}
						/>
			setUpdateForm(t);
			setShouldShowUpdateForm(true)
		}catch(err){
			console.log(err);
			setErrMsg('There was a problem updating this assignment');
		}
	}
	const remove = async (classID, assID) =>{
		const res = await assReq.delete(classID, assID);
		res.success ? getAssignments() : setErrMsg(res.error);
	}

	const AssignmentContainer = sortType.object;
	return(
		<React.Fragment>
			<MessageFlasher timeOut={3000} condition={errMsg!==''} resetter={() => setErrMsg('')}>
				<AbsractError errorMessage={errMsg}/>
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
						edit={(classID, assID) => edit(classID, assID)}
            			delete={(classID, assID) => remove(classID, assID)}
						setCompleted={(id, b) => setCompleted(id, b)} 
						assignments={assignments}
					/>
				</div>
			</div>
			<FadeInOutHandleState condition={shouldShowUpdateForm}>
				<React.Fragment>
					{updateForm}
				</React.Fragment>
			</FadeInOutHandleState>
		</React.Fragment>
	)
}

function findAssignment(assignmentData, assID){
	for(let i =0; i< assignmentData.length; i++){
		if(assignmentData[i].assignment._id + "" === assID + "")
			return assignmentData[i];
	}
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
