import React, { useEffect, useState } from 'react';
import moment from 'moment';

import Loader from '../../../../../Shared Resources/Effects/Loader/loader';
import {FadeInOutHandleState, FadeDownUpHandleState, FadeRightHandleState} from '../../../../../Shared Resources/Effects/CustomTransition';

import './index.css';

let actingTimeout = null;
function Assignment(props){
	const [showMore, setShowMore] = useState(false);
	const [hovering, setHovering] = useState(false);
	const [acting, setActing]     = useState(false);

	const handleActing = ()=>{
		setActing(true);
		actingTimeout = setTimeout(function(){
			setActing(false);
		},5000);
	}

	useEffect(() =>{
		return () => {
			//functional equivalent to componentWillUnmount
			clearTimeout(actingTimeout);
		}
	}, [])

	return(
		<div className={'assignment ' + findColor(props.dueDate)} onMouseEnter={() =>setHovering(true)}
		onMouseLeave={() =>setHovering(false)}>
			{acting? <Loader/> : null}
			<FadeRightHandleState condition={hovering}>
				<EditDelete delete={() => {handleActing(); props.delete()}} edit={() => props.edit()}/>
			</FadeRightHandleState>
			<div>
				<ClassColorDot color={props.color}/>
				<span>{props.name}</span>
				<Completed setCompleted={(b) => props.setCompleted(b)} completed={props.completed}/>
			</div>
			<FadeDownUpHandleState condition={showMore}>
				<MoreInformation dueDate={props.dueDate} description={props.description} dueTime={props.dueTime}/>
			</FadeDownUpHandleState>
			<MoreInformationToggler toggled={(b) => setShowMore(b)}/>
		</div>
	)
}

function EditDelete(props){
	return(
		<div className='edit-delete'>
			<button onClick={() => props.edit()} className='orange-bc white-c'><i class="fas fa-edit"></i></button>
			<button onClick={() => props.delete()} className='red-bc white-c'><i class="fas fa-trash"></i></button>
		</div>
	)
}

function ClassColorDot(props){
	return(
		<div className='color-dot' style={{background: props.color ? props.color: null}}/>
	)
}

function Completed(props){
	const [complete, setComplete] = useState(props.completed);
	const handleClick=()=>{
		const t = !complete;
		setComplete(t);
		props.setCompleted(t);
	}
	return(
		<button onClick={() => handleClick()} className={complete ? 'green-bc white-c completed' : 'completed'}>
			<i class="fas fa-check"></i>
		</button>
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