import React, {useState, useEffect} from 'react';
import moment from 'moment';

//concrete components
import NewAssignment from './New Assignment/NewAssignment';
// import FullAssList from './Expanded View/FullAssList';

//API requesters
import SemesterRequests   from '../../../APIRequests/Semester';
import AssignmentRequests from '../../../APIRequests/Assignment';

//Effects
import {FadeInOutHandleState, FadeDownUpHandleState} from '../../Shared Resources/Effects/CustomTransition';
import Loader from '../../Shared Resources/Effects/Loader/loader';

import WeekContainer from './Assignment Containers/Concrete Containers/WeekContainer';
import ClassContainer from './Assignment Containers/Concrete Containers/ClassContainer';
import AllContainer from './Assignment Containers/Concrete Containers/AllContainer';
import AbsractError from '../../Shared Resources/Messages/Error Messages/AbsractError';
import MessageFlasher  from '../../Shared Resources/MessageFlasher';

function AssignmentDashboard(props){
	// const semReq = new SemesterRequests(props.currentUserID);
	const assReq = new AssignmentRequests(props.currentUserID);

	const [shouldShowNewForm, setShouldShowNewForm]     = useState(false);
	const [assignments, setAssignments]					= useState([]);
	const [sortType, setSortType] 						= useState(sortOptions[0]);
	const [errMsg, setErrMsg]							= useState('');

	useEffect(() => {
		getAssignments();
	}, [])

	const getAssignments = async () => {
		const res = await assReq.getAll();
		if(res.success){
			setAssignments(res.assignments);
		}else{
			setErrMsg(res.error);
		}
	}

	

	// useEffect(() => {
	// 	async function fetchData(){
	// 		setUpcommingAss(await assReq.getUpcomming());
	// 	}
	// 	fetchData();

	// 	return () => {}
	// }, [shouldShowNewForm, editCount, editClassIndex]);

	// useEffect(() => {
	// 	async function fetchData(){
	// 		setCurrSemester(await semReq.getCurrSemWClasses());
	// 	}
	// 	fetchData();

	// 	return () => {}
	// }, [shouldShowNewForm, editCount, editClassIndex]);

	// const deleteAss = async (classID, assID) => {
	// 	const res = await assReq.delete(classID, assID); 
	// 	let ct = editCount;
	// 	setEditCount(++ct);
	// 	if(!res.success){
	// 		alert('Unable to delete assignment');
	// 	}
	// }


	// const assignments = upCommingAss ? upCommingAss.map((data, index) =>
	// 	<Assignment 
	// 		data={data.ass}
	// 		key={data.ass._id}
	// 		toggleCompleted={(id, isCompleted) => assReq.toggleCompleted(id, {complete: isCompleted})}
	// 		editAssignment={() => {setEditClassIndex(index);}}
	// 		deleteAssignment={() => deleteAss(data.parentClassID, data.ass._id)}
	// 	/>
	// ): null;
	

	const AssignmentContainer = sortType.object;
	return(
		<React.Fragment>
			<MessageFlasher condition={errMsg!==''} resetter={() => setErrMsg('')} animation={FadeDownUpHandleState}>
				<AbsractError errorMessage={errMsg} />
			</MessageFlasher>
			<div className='assignment-dashboard sans-font' style={props.style}>
				<h1 className='gray-c '>Assignments</h1>
				<button onClick={() => setShouldShowNewForm(true)} className='add green-bc'>Add</button>
				<SortSelector sortType={sortType} setSortType={(type) => setSortType(type)}/>
				<hr/>

				<AssignmentContainer assignments={assignments}/>
			</div>
			<FadeInOutHandleState condition={shouldShowNewForm}>
				<NewAssignment 
					hideForm={() => setShouldShowNewForm(false)}
					currentUserID={props.currentUserID}
					// editData={editClassIndex !==null ? upCommingAss[editClassIndex] : null}
				/>
			</FadeInOutHandleState>
		</React.Fragment>
	);
}

const sortOptions = [
	{
		name: 'This Week',
		object: WeekContainer,
	},
	{
		name: 'By Class',
		object: ClassContainer,
	},
	{
		name: 'All',
		object: AllContainer
	}
]

function SortSelector(props){
	const options = sortOptions;

	const items = options.map((option, index) => 
		<SortItem 
			isSelected={props.sortType.object === option.object} 
			name={option.name}  
			handleClick={() => props.setSortType(option)}
		/>
	)
	return(
		<div className='sort-selector'>
			<div className='row'>
				{items}
			</div>
		</div>
	)
}




function SortItem(props){
	const color = props.isSelected ? 'light-green-bc' : 'black-bc'
	return(
		<div className='sort-item col-lg-4'>
			<button onClick={() => props.handleClick()} className={'white-c ' + color}>{props.name}</button>
		</div>
	)
}

export default AssignmentDashboard;