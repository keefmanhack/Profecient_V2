import React, { useEffect, useState } from 'react';
import moment from 'moment';

import Loader from '../Effects/Loader/loader';
import {FadeInOutHandleState, FadeDownUpHandleState} from '../Effects/CustomTransition';

import './index.css';

function Assignment(props){
	const [showMore, setShowMore] = useState(false);

	return(
        <div 
            className={'assignment ' + findColor(props.dueDate)} 
            onMouseEnter={() => props.entered ? props.entered() : null}
		    onMouseLeave={() => props.left ? props.left() : null}
        >
            {props.acting? <Loader/> : null}
            {props.editDelete}
			<div>
				<ClassColorDot color={props.color}/>
				<span>{props.name}</span>
                {props.completed}
			</div>
			<FadeDownUpHandleState condition={showMore}>
				<MoreInformation dueDate={props.dueDate} description={props.description} dueTime={props.dueTime}/>
			</FadeDownUpHandleState>
			<MoreInformationToggler toggled={(b) => setShowMore(b)}/>
		</div>
	)
}

function ClassColorDot(props){
	return(
		<div className='color-dot' style={{background: props.color ? props.color: null}}/>
	)
}

function MoreInformation(props){
	const dateTime = moment(props.dueDate).format('MMM DD YY') + "   " + moment(props.dueTime).format('h:mm a')
	return(
		<div className='more-info'>
			<p>{props.description}</p>
			<h5>{dateTime}</h5>
		</div>
	)
}

function MoreInformationToggler(props){
	const [show, setShow] = useState(false);
	const [down, setDown] = useState(false);
	const handleChange = () => {
		const t = !down; 
		setDown(t);
		props.toggled(t);
	}
	return(
		<div className='see-more' onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
			<FadeInOutHandleState condition={show}>
				<button onClick={() => handleChange()}>
					{down ? <i className='fas fa-chevron-up'></i> : <i className='fas fa-chevron-down'></i>}
				</button>
			</FadeInOutHandleState>
		</div>

	)
}

function findColor(dueDate){
	const d = moment(dueDate).startOf('day');
	let colorClass = 'muted-green-bc';

	if(moment().add(1, 'days') >= d){
		colorClass = 'muted-red-bc';
	}else if(moment().add(3, 'days') >= d){
		colorClass = 'muted-orange-bc';
	}
	return colorClass;
}

export default Assignment;