import React from 'react';
import axios from 'axios';
import moment from 'moment';

import Loader from '../Effects/loader';
import {FadeRight_HandleState, FadeInOut_HandleState} from '../Effects/CustomTransition';
import {SuccessCheck} from '../Effects/lottie/LottieAnimations';

import './LinkSelector.css';

class LinkSelector extends React.Component{
	constructor(props){
		super(props);

		this.state={
			currSemester: null,
			selectedIndex: -1,
			success: false,
		}
	}

	componentDidMount(){
		this.getClassData();
	}

	getClassData(){
		axios.get(`http://localhost:8080/users/` + this.props.currentUser._id + '/semesters/current')
	    .then(res => {
			this.setState({
				currSemester: res.data
			})
		})
	}

	addNewLink(){
		const endPoint = `http://localhost:8080/users/` + this.props.currentUser._id + '/class/connection';
		const data={
			otherUser: this.props.otherUserID,
			otherUserClass: this.props.linkClass._id,
			currUserClass: this.state.currSemester.classes[this.state.selectedIndex]._id,
		}

		axios.post(endPoint, data)
	    .then(res => {
			this.setState({success: true})
		})
	}


	/*
	Data needed
	-----------
	-currentUser
	-otherUser
	-Data about class to be linked to
	-currentUser current semester class list
	*/

	render(){
		const classItems = this.state.currSemester ? this.state.currSemester.classes.map((data, index) => 
			<ClassItem 
				data={data} 
				selected={this.state.selectedIndex>-1 && this.state.selectedIndex===index} 
				classItemClicked={() => this.setState({selectedIndex: index})} key={index}
			/>
		) : null;

		const linkClass= this.props.linkClass;
		const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
		const daySpans = days.map((day, index)=>
				<span style={linkClass.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
		);
		const startTime = moment(linkClass.time.start).format('h:mm a');
		const endTime = moment(linkClass.time.end).format('h:mm a');
		return(
			<div className='link-selector form-bc sans-font'>
				<FadeInOut_HandleState condition={this.state.success}>
	 				<SuccessCheck onCompleted={() =>this.props.hideForm()}/>
	 			</FadeInOut_HandleState>
				<button onClick={() => this.props.hideForm()} className='cancel red-c'>Cancel</button>
				<FadeRight_HandleState condition={this.state.selectedIndex>-1}>
					<button onClick={() => this.addNewLink()} className='add blue-bc'>Add Link</button>
				</FadeRight_HandleState>
				{this.state.currSemester ?
					<React.Fragment>	
						<h1 className='bold-text'>{this.state.currSemester.name}</h1>
						<h5 className='light-text muted-c'>Add new link</h5>
						<hr/>
						<div className='gray-bc link-info'>
							<h2>{linkClass.name}</h2>
							<h3>{linkClass.instructor}</h3>
							<h4>{linkClass.location}</h4>
							<h4 className='indent light-text'>{daySpans}</h4>
							<h4 className='indent light-text'>{startTime} - {endTime}</h4>
						</div>
						<div className='class-items white-bc'>
							{classItems}
						</div>
					</React.Fragment>
				:
					<Loader/>
				}
			</div>
		);
	}
}

function ClassItem(props){
	const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	const daySpans = days.map((day, index)=>
			<span style={props.data.daysOfWeek[index] ? {fontWeight: 800}: {fontWeight: 200}} key={index}> {day} </span>
	);
	const startTime = moment(props.data.time.start).format('h:mm a');
	const endTime = moment(props.data.time.end).format('h:mm a');
	return(
		<div 
			className='class-item' 
			onClick={() => props.classItemClicked()} 
			style={props.selected ? {border: '4px solid #007bff', transition: '.3s'} : null}
		>
			<h2>{props.data.name}</h2>
			<h3>{props.data.instructor}</h3>
			<h4>{props.data.location}</h4>
			<h4 className='indent light-text'>{daySpans}</h4>
			<h4 className='indent light-text'>{startTime} - {endTime}</h4>
		</div>
	)
}

export default LinkSelector;