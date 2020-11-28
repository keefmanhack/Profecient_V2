import React, {useState, useEffect} from 'react';

import CurrentSemesterView from './Current Semester View/CurrentSemesterView';
import ClassList from './Class List/ClassList';
import SemesterEditorDialog from './SemesterEditorDialog';

import SemesterRequests from '../../../APIRequests/Semester';

import Loader from '../../Shared Resources/Effects/Loader/loader';
import MessageFlasher from '../../Shared Resources/MessageFlasher';
import AbsractError from '../../Shared Resources/Messages/Error Messages/AbsractError';

import './class-view.css';

function ClassView(props){
	const semReq = new SemesterRequests(props.userID);
	const isCurrentUserViewing = true;
	const [semesters, setSemesters] = useState([]);
	const [currSemID, setCurrSemesterID] = useState(null);
	const [errMsg, setErrMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getSemesters();
	}, []);

	const getSemesters = async () => {
		setIsLoading(true);
		const res = await semReq.getAllSems();
		setIsLoading(false);
		if(res.success){
			setSemesters(res.semesters);
			setCurrSemesterID(res.semesters[res.semesters.length]._id)
		}else{
			setErrMsg(res.error);
		}
	}
	const deleteSemester = async () => {
		setIsLoading(true);
		const res = await semReq.remove(currSemID);
		setIsLoading(false);
		res.success ? getSemesters() : setErrMsg(res.error);
	}
	const areSemesters = semesters.length>0;
	return(
		<div className='class-view-container'>
			{isLoading ? <Loader/> : null}
			<MessageFlasher condition={errMsg!==''} resetter={() => setErrMsg('')}>
				<AbsractError errorMessage={errMsg}/>
			</MessageFlasher>

			<CurrentSemesterView sem={findCurrentSemester(semesters, currSemID)}/>
			<hr/>
			<ClassList/>
			{areSemesters ?
				<SemesterEditorDialog 
					semesters={semesters}
					currSemID={currSemID}
					setCurrSemesterID={(id) => setCurrSemesterID(id)}
					deleteSemester={() => deleteSemester()}
					isCurrentUserViewing={props.isCurrentUserViewing}
				/>
			:null}
		</div>
	);
}

function findCurrentSemester(semesters, id){
	for(let i =0; i<semesters.length; i++){
		if(semesters[i]._id + '' === id + ''){
			return semesters[i];
		}
	}
	return null;
}

export default ClassView;