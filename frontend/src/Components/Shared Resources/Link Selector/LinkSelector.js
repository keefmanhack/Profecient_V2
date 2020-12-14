import React, { useState, useEffect } from 'react';

import SimpleContainer from '../Class Containers/SimpleContainer/SimpleContainer';
import SelectableClassList from '../Class List/SelectableClassList';


import SemesterRequests from '../../../APIRequests/Semester';
import ClassRequests from '../../../APIRequests/Class';

import MessageFlasher from '../MessageFlasher';
import AbsractError from '../Messages/Error Messages/AbsractError';
import Loader from '../Effects/Loader/loader';
import {FadeRightHandleState, FadeInOutHandleState} from '../Effects/CustomTransition';
import {SuccessCheck} from '../Effects/lottie/LottieAnimations';

import './LinkSelector.css';

function LinkSelector(props){
	const semReq = new SemesterRequests(props.currentUserID);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState('');
	const [selectedClassID, setSelectedClassID] = useState(null);
	const [currSemester, setCurrSemester] = useState(null);

	useEffect(() => {
		getSemester();
	}, []);

	const getSemester = async () => {
		setLoading(true);
		const res = await semReq.getCurrent();
		setLoading(false);
		res.success ? setCurrSemester(res.semester) : setErrMsg(res.error);
	}

	const addNewLink = async () => {
		const classReq = new ClassRequests(props.currentUserID);
		const res = await classReq.addNewConnection(props.linkedUserID, props.linkedClass._id, selectedClassID);
		res.success ? setSuccess(true) : setErrMsg(res.error);
	}

	return(
		<React.Fragment>
			<div className='background-shader'/>
			<div className='link-selector form-bc sans-font'>
				{loading ? <Loader/> : null}
				<FadeInOutHandleState condition={success}>
					<SuccessCheck onCompleted={() =>props.hideForm()}/>
				</FadeInOutHandleState>
				<button onClick={() => props.hideForm()} className='cancel red-c'>Cancel</button>
				<FadeRightHandleState condition={!!selectedClassID}>
					<button onClick={() => addNewLink()} className='add blue-bc'>Add Link</button>
				</FadeRightHandleState>
				<MessageFlasher condition={errMsg !== ''} resetter={()=>setErrMsg('')}>
					<AbsractError errorMessage={errMsg}/>
				</MessageFlasher>
				<Header
					currSemester={currSemester}
				/>
				<SimpleContainer
					name={props.linkedClass.name}
					instructor={props.linkedClass.instructor}
					location={props.linkedClass.location}
					daysOfWeek={props.linkedClass.daysOfWeek}
					time={props.linkedClass.time}
					classList={'gray-bc'}
				/>
				<ClassList 
					currSemester={currSemester}
					classSelected={(id) => setSelectedClassID(id)}
					userID={props.currentUserID}
					selectedID={selectedClassID}
				/>
			</div>
		</React.Fragment>
	)
}

function ClassList(props){
	if(!props.currSemester){
		return(
			<div className='light-grey-bc animate__animated animate__faster animate__fadeIn' style={{textAlign: 'center', borderRadius:5}}>
                <p className='white-c'>You haven't created a semester</p>
            </div>
		)
	}else{
		return(
			<SelectableClassList
				semID={props.currSemester._id}
				classSelected={(id) => props.classSelected(id)}
				userID={props.userID}
				selectedID={props.selectedID}
			/>
		)
	}
}

function Header(props){
	return(
		<div>
			{props.currSemester ?
				<React.Fragment>
					<h1 className='bold-text semester'>{props.currSemester.name}</h1>
					<h5 className='light-text muted-c'>Add new link</h5>
				</React.Fragment>
			:
				<h1 className='muted-c'>No Semester Exists</h1>
			}
			<hr/>
		</div>
	)
}

export default LinkSelector;