import React, {useState, useEffect} from 'react';

import ClassRequests from '../../../../../APIRequests/Class';

import MessageFlasher from '../../../../Shared Resources/MessageFlasher';
import {FadeDownUpHandleState} from '../../../../Shared Resources/Effects/CustomTransition';
import AbsractError from '../../../../Shared Resources/Messages/Error Messages/AbsractError';
import Loader from '../../../../Shared Resources/Effects/Loader/loader';

import './index.css';

function ClassLegend(props){
	const classReq = new ClassRequests(props.currentUserID);
	const [classes, setClasses] = useState(null);
	const [errMsg, setErrMsg] = useState(''); 

	useEffect(() => {
		getClasses();
	}, []);

	const getClasses = async () => {
		const res = await classReq.getCurrent();
		if(res.success){
			setClasses(res.classes);
		}else{
			setErrMsg(res.error);
		}
	}

	return(
		<React.Fragment>
			<MessageFlasher condition={errMsg!==''} resetter={() => setErrMsg('')} animation={FadeDownUpHandleState}>
				<AbsractError errorMessage={errMsg} />
			</MessageFlasher>
			<div className='class-legend'>
				{!classes? <Loader/> :	<Classes classes={classes}/>}
			</div>
		</React.Fragment>

	)
}

function Classes(props){
	const classes = props.classes.map((data) => 
		<Class color={data.color ? data.color : '#C724B1'} key={data._id} name={data.name}/>
	)
	return(
		<div className='row'>
			{classes}
		</div>
	)
}

function Class(props){
	return(
		<div className='col-lg-3'>
			<div className='class white-c animate__animated animate__faster animate__fadeIn' style={{background: props.color}}>
				{props.name}
			</div>
		</div>
	)
}

export default ClassLegend;