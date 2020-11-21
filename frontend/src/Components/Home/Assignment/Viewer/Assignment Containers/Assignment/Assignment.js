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
				<Completed setCompleted={(b) => props.setCompleted(b)} isCompleted={props.completed}/>
			</div>
			<FadeDownUpHandleState condition={showMore}>
				<MoreInformation description={props.description} dueTime={props.dueTime}/>
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
		<button onClick={() => handleClick()} className={complete ? 'light-green-bc completed' : 'completed'}>
			<i class="fas fa-check"></i>
		</button>
	)
}

function MoreInformation(props){
	return(
		<div className='more-info'>
			<p>{props.description}</p>
			<h5>{moment(props.dueTime).format('h:mm a')}</h5>
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


// class Assignment extends React.Component{
// 	constructor(props){
// 		super(props);

// 		this.state ={
// 			showDialog: false,
// 			completed: false,
// 			mouseOver: false,
// 			deleting: false,
// 		}

// 		this.timeOut = null;
// 	}

// 	toggleDropDown(){
// 		const showDialog_copy = this.state.showDialog;

// 		this.setState({
// 			showDialog: !showDialog_copy,
// 		})
// 	}

// 	toggleComplete(){
// 		const completed_copy = this.state.completed;

// 		this.props.toggleCompleted(this.props.data._id, !completed_copy);

// 		this.setState({
// 			completed: !completed_copy,
// 		})
// 	}

// 	deleteItem(){
// 		this.setState({deleting: true});
// 		this.timeOut = setTimeout(function(){
// 			this.setState({deleting: false});
// 		}.bind(this), 3000);
// 		this.props.deleteAssignment();
// 	}

// 	componentWillUnmount(){
// 		clearTimeout(this.timeOut);
// 	}

// 	render(){
// 		let colorClass = 'muted-green-bc';

// 		if(moment().add(1, 'days') >= moment(this.props.dueDate)){
// 			colorClass = 'muted-red-bc';
// 		}else if(moment().add(3, 'days') >= moment(this.props.dueDate)){
// 			colorClass = 'muted-orange-bc';
// 		}

// 		return(
// 			<div onMouseEnter={() => this.setState({mouseOver: true})} onMouseLeave={() => this.setState({mouseOver: false})} className={'assignment animate__animated animate__faster animate__fadeInDown sans-font ' + colorClass}>
// 				{this.state.deleting ? <Loader/>: null}
// 				<div className='row'>
// 					<div className='col-lg-6'>
// 						<h1>{this.props.name}</h1>
// 					</div>
// 					<div className='col-lg-4'>
// 						<h2 className='truncate'>{moment(this.props.dueDate).format('dddd')}</h2>
// 					</div>
// 					<div className='col-lg-2'>
// 						<button onClick={() => this.toggleComplete()} className={this.state.completed ? 'light-green-bc completed' : 'completed'}>
// 							<i class="fas fa-check"></i>
// 						</button>
// 					</div>
// 				</div>
// 				<FadeDownUpHandleState condition={this.state.showDialog}>
// 					<div className='more-info'>
// 						<p>{this.props.description}</p>
// 						<h5>{moment(this.props.dueTime).format('h:mm a')}</h5>
// 						<button onClick={() => this.props.editAssignment()}>Edit</button>
// 						<button onClick={() => this.deleteItem()}>Delete</button>
// 					</div>
// 				</FadeDownUpHandleState>
// 				<FadeInOutHandleState condition={this.state.mouseOver}>
// 					<button className='see-more' onClick={()=> this.toggleDropDown()}>
// 						{this.state.showDialog ? <i className='fas fa-chevron-up'></i> : <i className='fas fa-chevron-down'></i>}
// 					</button>
// 				</FadeInOutHandleState>	
// 			</div>
// 		);
// 	}
// }

export default Assignment;